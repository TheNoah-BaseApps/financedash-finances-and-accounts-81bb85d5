/**
 * @swagger
 * /api/cash-flow-forecast:
 *   get:
 *     summary: Get cash flow forecasts
 *     tags: [Cash Flow]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create new forecast
 *     tags: [Cash Flow]
 *     responses:
 *       201:
 *         description: Created
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { requireAuth } from '@/lib/auth';
import { 
  calculateTotalReceipts, 
  calculateTotalCashPayments, 
  calculateNetCashChange, 
  calculateMonthEndingCashPosition 
} from '@/lib/calculations';
import { isValidDate } from '@/lib/validation';
import { logCreate } from '@/lib/audit';

export async function GET(request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let queryText = `
      SELECT * FROM cash_flow_forecast
      WHERE user_id = $1
    `;
    const params = [user.userId];
    let paramCount = 2;

    if (startDate) {
      queryText += ` AND period_start >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      queryText += ` AND period_end <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    queryText += ` ORDER BY period_start ASC`;

    const result = await query(queryText, params);

    return NextResponse.json(
      {
        success: true,
        data: result.rows || []
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/cash-flow-forecast:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch forecasts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();

    const {
      category,
      period_start,
      period_end,
      beginning_balance,
      cash_sales,
      customer_account_collections,
      loan_cash_injection,
      interest_income,
      tax_refund,
      other_cash_receipts,
      direct_product_svc_costs,
      payroll_taxes,
      vendor_payments,
      supplies,
      rent,
      loan_payments,
      purchase_of_fixed_assets,
      additional_operating_expenses,
      additional_overhead_expenses
    } = body;

    // Validate required fields
    if (!category || !period_start || !period_end || beginning_balance === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    if (!isValidDate(period_start) || !isValidDate(period_end)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Calculate totals
    const forecastData = {
      cash_sales: cash_sales || 0,
      customer_account_collections: customer_account_collections || 0,
      loan_cash_injection: loan_cash_injection || 0,
      interest_income: interest_income || 0,
      tax_refund: tax_refund || 0,
      other_cash_receipts: other_cash_receipts || 0,
      direct_product_svc_costs: direct_product_svc_costs || 0,
      payroll_taxes: payroll_taxes || 0,
      vendor_payments: vendor_payments || 0,
      supplies: supplies || 0,
      rent: rent || 0,
      loan_payments: loan_payments || 0,
      purchase_of_fixed_assets: purchase_of_fixed_assets || 0,
      additional_operating_expenses: additional_operating_expenses || 0,
      additional_overhead_expenses: additional_overhead_expenses || 0
    };

    const total_receipts = calculateTotalReceipts(forecastData);
    const total_cash_payments = calculateTotalCashPayments(forecastData);
    const net_cash_change = calculateNetCashChange(total_receipts, total_cash_payments);
    const month_ending_cash_position = calculateMonthEndingCashPosition(beginning_balance, net_cash_change);

    // Insert record
    const result = await query(
      `INSERT INTO cash_flow_forecast (
        user_id, category, period_start, period_end, beginning_balance,
        cash_sales, customer_account_collections, loan_cash_injection, interest_income,
        tax_refund, other_cash_receipts, direct_product_svc_costs, payroll_taxes,
        vendor_payments, supplies, rent, loan_payments, purchase_of_fixed_assets,
        additional_operating_expenses, additional_overhead_expenses,
        total_cash_payments, net_cash_change, month_ending_cash_position,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW(), NOW())
      RETURNING *`,
      [
        user.userId, category, period_start, period_end, beginning_balance,
        forecastData.cash_sales, forecastData.customer_account_collections,
        forecastData.loan_cash_injection, forecastData.interest_income,
        forecastData.tax_refund, forecastData.other_cash_receipts,
        forecastData.direct_product_svc_costs, forecastData.payroll_taxes,
        forecastData.vendor_payments, forecastData.supplies, forecastData.rent,
        forecastData.loan_payments, forecastData.purchase_of_fixed_assets,
        forecastData.additional_operating_expenses, forecastData.additional_overhead_expenses,
        total_cash_payments, net_cash_change, month_ending_cash_position
      ]
    );

    const newRecord = result.rows[0];

    // Log audit
    await logCreate(user.userId, 'cash_flow_forecast', newRecord.id, newRecord);

    return NextResponse.json(
      {
        success: true,
        data: newRecord,
        message: 'Forecast created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/cash-flow-forecast:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create forecast' },
      { status: 500 }
    );
  }
}