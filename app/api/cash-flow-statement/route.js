import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/cash-flow-statement:
 *   get:
 *     summary: Get all cash flow statements
 *     description: Retrieve all cash flow statement records with pagination
 *     tags: [Cash Flow Statement]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Successfully retrieved cash flow statements
 *       500:
 *         description: Internal server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');

    let queryText = 'SELECT * FROM cash_flow_statement';
    const params = [];
    
    if (category) {
      queryText += ' WHERE category = $1';
      params.push(category);
      queryText += ' ORDER BY created_at DESC LIMIT $2 OFFSET $3';
      params.push(limit, offset);
    } else {
      queryText += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
      params.push(limit, offset);
    }

    const result = await query(queryText, params);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching cash flow statements:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/cash-flow-statement:
 *   post:
 *     summary: Create a new cash flow statement
 *     description: Create a new cash flow statement record
 *     tags: [Cash Flow Statement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *             properties:
 *               category:
 *                 type: string
 *               net_income:
 *                 type: number
 *               changes_in_working_capital:
 *                 type: number
 *               depreciation_and_amortization:
 *                 type: number
 *               accounts_receivable:
 *                 type: number
 *               accounts_payable:
 *                 type: number
 *               deferred_taxes:
 *                 type: number
 *               other:
 *                 type: number
 *               cash_from_sale_of_capital_assets:
 *                 type: number
 *               cash_paid_for_purchase_of_capital_assets:
 *                 type: number
 *               increases_in_long_term_assets:
 *                 type: number
 *               proceeds_from_common_stock_issuance:
 *                 type: number
 *               proceeds_from_long_term_debt_issuance:
 *                 type: number
 *               dividends_paid_out:
 *                 type: number
 *               proceeds_from_preferred_stock_issuance:
 *                 type: number
 *               net_change_in_cash_and_cash_equivalents:
 *                 type: number
 *               cash_at_beginning_of_period:
 *                 type: number
 *               cash_at_end_of_period:
 *                 type: number
 *     responses:
 *       201:
 *         description: Cash flow statement created successfully
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.category) {
      return NextResponse.json(
        { success: false, error: 'Category is required' },
        { status: 400 }
      );
    }

    const {
      category, net_income, changes_in_working_capital, depreciation_and_amortization,
      accounts_receivable, accounts_payable, deferred_taxes, other,
      cash_from_sale_of_capital_assets, cash_paid_for_purchase_of_capital_assets,
      increases_in_long_term_assets, proceeds_from_common_stock_issuance,
      proceeds_from_long_term_debt_issuance, dividends_paid_out,
      proceeds_from_preferred_stock_issuance, net_change_in_cash_and_cash_equivalents,
      cash_at_beginning_of_period, cash_at_end_of_period
    } = body;

    const result = await query(
      `INSERT INTO cash_flow_statement (
        category, net_income, changes_in_working_capital, depreciation_and_amortization,
        accounts_receivable, accounts_payable, deferred_taxes, other,
        cash_from_sale_of_capital_assets, cash_paid_for_purchase_of_capital_assets,
        increases_in_long_term_assets, proceeds_from_common_stock_issuance,
        proceeds_from_long_term_debt_issuance, dividends_paid_out,
        proceeds_from_preferred_stock_issuance, net_change_in_cash_and_cash_equivalents,
        cash_at_beginning_of_period, cash_at_end_of_period
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *`,
      [
        category, net_income, changes_in_working_capital, depreciation_and_amortization,
        accounts_receivable, accounts_payable, deferred_taxes, other,
        cash_from_sale_of_capital_assets, cash_paid_for_purchase_of_capital_assets,
        increases_in_long_term_assets, proceeds_from_common_stock_issuance,
        proceeds_from_long_term_debt_issuance, dividends_paid_out,
        proceeds_from_preferred_stock_issuance, net_change_in_cash_and_cash_equivalents,
        cash_at_beginning_of_period, cash_at_end_of_period
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating cash flow statement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}