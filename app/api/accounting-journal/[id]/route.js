import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/accounting-journal/{id}:
 *   get:
 *     summary: Get a specific accounting journal entry
 *     description: Retrieve details of a single accounting journal entry by ID
 *     tags: [Accounting Journal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Journal entry ID
 *     responses:
 *       200:
 *         description: Journal entry details
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM accounting_journal WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching accounting journal entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/accounting-journal/{id}:
 *   put:
 *     summary: Update an accounting journal entry
 *     description: Update an existing journal entry
 *     tags: [Accounting Journal]
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
 *             properties:
 *               account_code:
 *                 type: string
 *               account_name:
 *                 type: string
 *               trial_balance_debit:
 *                 type: number
 *               trial_balance_credit:
 *                 type: number
 *               adjusting_entries_debit:
 *                 type: number
 *               adjusting_entries_credit:
 *                 type: number
 *               adjusted_trial_balance_debit:
 *                 type: number
 *               adjusted_trial_balance_credit:
 *                 type: number
 *               income_statement_debit:
 *                 type: number
 *               income_statement_credit:
 *                 type: number
 *               balance_sheet_debit:
 *                 type: number
 *               balance_sheet_credit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Entry updated successfully
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const queryText = `
      UPDATE accounting_journal SET
        account_code = COALESCE($1, account_code),
        account_name = COALESCE($2, account_name),
        trial_balance_debit = COALESCE($3, trial_balance_debit),
        trial_balance_credit = COALESCE($4, trial_balance_credit),
        adjusting_entries_debit = COALESCE($5, adjusting_entries_debit),
        adjusting_entries_credit = COALESCE($6, adjusting_entries_credit),
        adjusted_trial_balance_debit = COALESCE($7, adjusted_trial_balance_debit),
        adjusted_trial_balance_credit = COALESCE($8, adjusted_trial_balance_credit),
        income_statement_debit = COALESCE($9, income_statement_debit),
        income_statement_credit = COALESCE($10, income_statement_credit),
        balance_sheet_debit = COALESCE($11, balance_sheet_debit),
        balance_sheet_credit = COALESCE($12, balance_sheet_credit),
        updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `;

    const params = [
      body.account_code,
      body.account_name,
      body.trial_balance_debit,
      body.trial_balance_credit,
      body.adjusting_entries_debit,
      body.adjusting_entries_credit,
      body.adjusted_trial_balance_debit,
      body.adjusted_trial_balance_credit,
      body.income_statement_debit,
      body.income_statement_credit,
      body.balance_sheet_debit,
      body.balance_sheet_credit,
      id
    ];

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating accounting journal entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/accounting-journal/{id}:
 *   delete:
 *     summary: Delete an accounting journal entry
 *     description: Remove a journal entry from the system
 *     tags: [Accounting Journal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entry deleted successfully
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM accounting_journal WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Entry deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting accounting journal entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}