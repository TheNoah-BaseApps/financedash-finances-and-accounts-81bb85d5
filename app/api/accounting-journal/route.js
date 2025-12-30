import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/accounting-journal:
 *   get:
 *     summary: Get all accounting journal entries
 *     description: Retrieve a list of all accounting journal entries with pagination and filtering
 *     tags: [Accounting Journal]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of entries to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of entries to skip
 *       - in: query
 *         name: account_code
 *         schema:
 *           type: string
 *         description: Filter by account code
 *     responses:
 *       200:
 *         description: List of accounting journal entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const accountCode = searchParams.get('account_code');

    let queryText = 'SELECT * FROM accounting_journal';
    let params = [];
    let paramCount = 1;

    if (accountCode) {
      queryText += ` WHERE account_code ILIKE $${paramCount}`;
      params.push(`%${accountCode}%`);
      paramCount++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count
    const countQuery = accountCode 
      ? 'SELECT COUNT(*) FROM accounting_journal WHERE account_code ILIKE $1'
      : 'SELECT COUNT(*) FROM accounting_journal';
    const countParams = accountCode ? [`%${accountCode}%`] : [];
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching accounting journal entries:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/accounting-journal:
 *   post:
 *     summary: Create a new accounting journal entry
 *     description: Add a new entry to the accounting journal
 *     tags: [Accounting Journal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account_code
 *               - account_name
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
 *       201:
 *         description: Journal entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.account_code || !body.account_name) {
      return NextResponse.json(
        { success: false, error: 'Account code and name are required' },
        { status: 400 }
      );
    }

    const queryText = `
      INSERT INTO accounting_journal (
        account_code, account_name, 
        trial_balance_debit, trial_balance_credit,
        adjusting_entries_debit, adjusting_entries_credit,
        adjusted_trial_balance_debit, adjusted_trial_balance_credit,
        income_statement_debit, income_statement_credit,
        balance_sheet_debit, balance_sheet_credit,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *
    `;

    const params = [
      body.account_code,
      body.account_name,
      body.trial_balance_debit || 0,
      body.trial_balance_credit || 0,
      body.adjusting_entries_debit || 0,
      body.adjusting_entries_credit || 0,
      body.adjusted_trial_balance_debit || 0,
      body.adjusted_trial_balance_credit || 0,
      body.income_statement_debit || 0,
      body.income_statement_credit || 0,
      body.balance_sheet_debit || 0,
      body.balance_sheet_credit || 0
    ];

    const result = await query(queryText, params);

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating accounting journal entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}