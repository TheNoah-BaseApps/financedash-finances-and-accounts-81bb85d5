/**
 * @swagger
 * /api/cash-flow-forecast/{id}:
 *   put:
 *     summary: Update forecast
 *     tags: [Cash Flow]
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete forecast
 *     tags: [Cash Flow]
 *     responses:
 *       200:
 *         description: Deleted
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
import { isValidUUID } from '@/lib/validation';
import { logUpdate, logDelete } from '@/lib/audit';

export async function PUT(request, { params }) {
  try {
    const user = await requireAuth(request);
    const { id } = params;

    if (!isValidUUID(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Get existing record
    const existingResult = await query(
      'SELECT * FROM cash_flow_forecast WHERE id = $1 AND user_id = $2',
      [id, user.userId]
    );

    if (!existingResult.rows || existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Forecast not found' },
        { status: 404 }
      );
    }

    const oldRecord = existingResult.rows[0];
    const body = await request.json();

    // Merge old and new values
    const updatedData = { ...oldRecord, ...body };

    // Recalculate totals
    const total_receipts = calculateTotalReceipts(updatedData);
    const total_cash_payments = calculateTotalCashPayments(updatedData);
    const net_cash_change = calculateNetCashChange(total_receipts, total_cash_payments);
    const month_ending_cash_position = calculateMonthEndingCashPosition(
      updatedData.beginning_balance,
      net_cash_change
    );

    // Update record
    const result = await query(
      `UPDATE cash_flow_forecast SET
        category = COALESCE($1, category),
        period_start = COALESCE($2, period_start),
        period_end = COALESCE($3, period_end),
        beginning_balance = COALESCE($4, beginning_balance),
        cash_sales = COALESCE($5, cash_sales),
        customer_account_collections = COALESCE($6, customer_account_collections),
        loan_cash_injection = COALESCE($7, loan_cash_injection),
        interest_income = COALESCE($8, interest_income),
        tax_refund = COALESCE($9, tax_refund),
        other_cash_receipts = COALESCE($10, other_cash_receipts),
        direct_product_svc_costs = COALESCE($11, direct_product_svc_costs),
        payroll_taxes = COALESCE($12, payroll_taxes),
        vendor_payments = COALESCE($13, vendor_payments),
        supplies = COALESCE($14, supplies),
        rent = COALESCE($15, rent),
        loan_payments = COALESCE($16, loan_payments),
        purchase_of_fixed_assets = COALESCE($17, purchase_of_fixed_assets),
        additional_operating_expenses = COALESCE($18, additional_operating_expenses),
        additional_overhead_expenses = COALESCE($19, additional_overhead_expenses),
        total_cash_payments = $20,
        net_cash_change = $21,
        month_ending_cash_position = $22,
        updated_at = NOW()
      WHERE id = $23 AND user_id = $24
      RETURNING *`,
      [
        body.category, body.period_start, body.period_end, body.beginning_balance,
        body.cash_sales, body.customer_account_collections, body.loan_cash_injection,
        body.interest_income, body.tax_refund, body.other_cash_receipts,
        body.direct_product_svc_costs, body.payroll_taxes, body.vendor_payments,
        body.supplies, body.rent, body.loan_payments, body.purchase_of_fixed_assets,
        body.additional_operating_expenses, body.additional_overhead_expenses,
        total_cash_payments, net_cash_change, month_ending_cash_position,
        id, user.userId
      ]
    );

    const updatedRecord = result.rows[0];

    // Log audit
    await logUpdate(user.userId, 'cash_flow_forecast', id, oldRecord, updatedRecord);

    return NextResponse.json(
      {
        success: true,
        data: updatedRecord,
        message: 'Forecast updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/cash-flow-forecast/[id]:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update forecast' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth(request);
    const { id } = params;

    if (!isValidUUID(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Get existing record for audit
    const existingResult = await query(
      'SELECT * FROM cash_flow_forecast WHERE id = $1 AND user_id = $2',
      [id, user.userId]
    );

    if (!existingResult.rows || existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Forecast not found' },
        { status: 404 }
      );
    }

    const oldRecord = existingResult.rows[0];

    // Delete record
    await query(
      'DELETE FROM cash_flow_forecast WHERE id = $1 AND user_id = $2',
      [id, user.userId]
    );

    // Log audit
    await logDelete(user.userId, 'cash_flow_forecast', id, oldRecord);

    return NextResponse.json(
      {
        success: true,
        message: 'Forecast deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/cash-flow-forecast/[id]:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete forecast' },
      { status: 500 }
    );
  }
}