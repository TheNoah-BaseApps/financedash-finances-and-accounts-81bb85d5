import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/cash-flow-statement/{id}:
 *   get:
 *     summary: Get cash flow statement by ID
 *     description: Retrieve a specific cash flow statement record
 *     tags: [Cash Flow Statement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved cash flow statement
 *       404:
 *         description: Cash flow statement not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM cash_flow_statement WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cash flow statement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching cash flow statement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/cash-flow-statement/{id}:
 *   put:
 *     summary: Update cash flow statement
 *     description: Update an existing cash flow statement record
 *     tags: [Cash Flow Statement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Cash flow statement not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

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
      `UPDATE cash_flow_statement SET
        category = $1, net_income = $2, changes_in_working_capital = $3,
        depreciation_and_amortization = $4, accounts_receivable = $5,
        accounts_payable = $6, deferred_taxes = $7, other = $8,
        cash_from_sale_of_capital_assets = $9, cash_paid_for_purchase_of_capital_assets = $10,
        increases_in_long_term_assets = $11, proceeds_from_common_stock_issuance = $12,
        proceeds_from_long_term_debt_issuance = $13, dividends_paid_out = $14,
        proceeds_from_preferred_stock_issuance = $15, net_change_in_cash_and_cash_equivalents = $16,
        cash_at_beginning_of_period = $17, cash_at_end_of_period = $18,
        updated_at = now()
      WHERE id = $19 RETURNING *`,
      [
        category, net_income, changes_in_working_capital, depreciation_and_amortization,
        accounts_receivable, accounts_payable, deferred_taxes, other,
        cash_from_sale_of_capital_assets, cash_paid_for_purchase_of_capital_assets,
        increases_in_long_term_assets, proceeds_from_common_stock_issuance,
        proceeds_from_long_term_debt_issuance, dividends_paid_out,
        proceeds_from_preferred_stock_issuance, net_change_in_cash_and_cash_equivalents,
        cash_at_beginning_of_period, cash_at_end_of_period, id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cash flow statement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating cash flow statement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/cash-flow-statement/{id}:
 *   delete:
 *     summary: Delete cash flow statement
 *     description: Delete a cash flow statement record
 *     tags: [Cash Flow Statement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Cash flow statement not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM cash_flow_statement WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cash flow statement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cash flow statement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cash flow statement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}