import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/balance-sheet/{id}:
 *   get:
 *     summary: Get a balance sheet entry by ID
 *     description: Retrieve a specific balance sheet entry
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Balance sheet entry ID
 *     responses:
 *       200:
 *         description: Balance sheet entry details
 *       404:
 *         description: Balance sheet entry not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      'SELECT * FROM balance_sheet WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Balance sheet entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching balance sheet entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/balance-sheet/{id}:
 *   put:
 *     summary: Update a balance sheet entry
 *     description: Update an existing balance sheet entry
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Balance sheet entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Balance sheet entry updated successfully
 *       404:
 *         description: Balance sheet entry not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const sql = `
      UPDATE balance_sheet SET
        year = COALESCE($1, year),
        category = COALESCE($2, category),
        cash = COALESCE($3, cash),
        accounts_receivable = COALESCE($4, accounts_receivable),
        inventory = COALESCE($5, inventory),
        prepaid_expenses = COALESCE($6, prepaid_expenses),
        short_term_investments = COALESCE($7, short_term_investments),
        total_current_assets = COALESCE($8, total_current_assets),
        long_term_investments = COALESCE($9, long_term_investments),
        property_equipment = COALESCE($10, property_equipment),
        less_accumulated_depreciation = COALESCE($11, less_accumulated_depreciation),
        intangible_assets = COALESCE($12, intangible_assets),
        total_fixed_assets = COALESCE($13, total_fixed_assets),
        deferred_income_tax = COALESCE($14, deferred_income_tax),
        other_assets = COALESCE($15, other_assets),
        total_assets = COALESCE($16, total_assets),
        accounts_payable = COALESCE($17, accounts_payable),
        short_term_loans = COALESCE($18, short_term_loans),
        income_taxes_payable = COALESCE($19, income_taxes_payable),
        accrued_salaries_and_wages = COALESCE($20, accrued_salaries_and_wages),
        unearned_revenue = COALESCE($21, unearned_revenue),
        current_portion_of_long_term_debt = COALESCE($22, current_portion_of_long_term_debt),
        total_current_liabilities = COALESCE($23, total_current_liabilities),
        long_term_debt = COALESCE($24, long_term_debt),
        deferred_income_tax_liabilities = COALESCE($25, deferred_income_tax_liabilities),
        total_long_term_liabilities = COALESCE($26, total_long_term_liabilities),
        owners_investment = COALESCE($27, owners_investment),
        retained_earnings = COALESCE($28, retained_earnings),
        total_owners_equity = COALESCE($29, total_owners_equity),
        total_liabilities_and_owners_equity = COALESCE($30, total_liabilities_and_owners_equity),
        updated_at = NOW()
      WHERE id = $31
      RETURNING *
    `;

    const params = [
      body.year,
      body.category,
      body.cash,
      body.accounts_receivable,
      body.inventory,
      body.prepaid_expenses,
      body.short_term_investments,
      body.total_current_assets,
      body.long_term_investments,
      body.property_equipment,
      body.less_accumulated_depreciation,
      body.intangible_assets,
      body.total_fixed_assets,
      body.deferred_income_tax,
      body.other_assets,
      body.total_assets,
      body.accounts_payable,
      body.short_term_loans,
      body.income_taxes_payable,
      body.accrued_salaries_and_wages,
      body.unearned_revenue,
      body.current_portion_of_long_term_debt,
      body.total_current_liabilities,
      body.long_term_debt,
      body.deferred_income_tax_liabilities,
      body.total_long_term_liabilities,
      body.owners_investment,
      body.retained_earnings,
      body.total_owners_equity,
      body.total_liabilities_and_owners_equity,
      id
    ];

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Balance sheet entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating balance sheet entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/balance-sheet/{id}:
 *   delete:
 *     summary: Delete a balance sheet entry
 *     description: Delete a specific balance sheet entry
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Balance sheet entry ID
 *     responses:
 *       200:
 *         description: Balance sheet entry deleted successfully
 *       404:
 *         description: Balance sheet entry not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      'DELETE FROM balance_sheet WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Balance sheet entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Balance sheet entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting balance sheet entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}