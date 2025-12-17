import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/balance-sheet:
 *   get:
 *     summary: Get all balance sheet entries
 *     description: Retrieve all balance sheet entries with pagination support
 *     tags: [Balance Sheet]
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
 *         name: year
 *         schema:
 *           type: string
 *         description: Filter by year
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of balance sheet entries
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
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const yearFilter = searchParams.get('year');
    const categoryFilter = searchParams.get('category');

    let sql = 'SELECT * FROM balance_sheet WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (yearFilter) {
      sql += ` AND year = $${paramCount}`;
      params.push(yearFilter);
      paramCount++;
    }

    if (categoryFilter) {
      sql += ` AND category = $${paramCount}`;
      params.push(categoryFilter);
      paramCount++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching balance sheet entries:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/balance-sheet:
 *   post:
 *     summary: Create a new balance sheet entry
 *     description: Create a new balance sheet entry with assets, liabilities, and equity data
 *     tags: [Balance Sheet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - category
 *             properties:
 *               year:
 *                 type: string
 *               category:
 *                 type: string
 *               cash:
 *                 type: number
 *               accounts_receivable:
 *                 type: number
 *               inventory:
 *                 type: number
 *               prepaid_expenses:
 *                 type: number
 *               short_term_investments:
 *                 type: number
 *               total_current_assets:
 *                 type: number
 *               long_term_investments:
 *                 type: number
 *               property_equipment:
 *                 type: number
 *               less_accumulated_depreciation:
 *                 type: number
 *               intangible_assets:
 *                 type: number
 *               total_fixed_assets:
 *                 type: number
 *               deferred_income_tax:
 *                 type: number
 *               other_assets:
 *                 type: number
 *               total_assets:
 *                 type: number
 *               accounts_payable:
 *                 type: number
 *               short_term_loans:
 *                 type: number
 *               income_taxes_payable:
 *                 type: number
 *               accrued_salaries_and_wages:
 *                 type: number
 *               unearned_revenue:
 *                 type: number
 *               current_portion_of_long_term_debt:
 *                 type: number
 *               total_current_liabilities:
 *                 type: number
 *               long_term_debt:
 *                 type: number
 *               deferred_income_tax_liabilities:
 *                 type: number
 *               total_long_term_liabilities:
 *                 type: number
 *               owners_investment:
 *                 type: number
 *               retained_earnings:
 *                 type: number
 *               total_owners_equity:
 *                 type: number
 *               total_liabilities_and_owners_equity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Balance sheet entry created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.year || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Year and category are required' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO balance_sheet (
        year, category, cash, accounts_receivable, inventory, prepaid_expenses,
        short_term_investments, total_current_assets, long_term_investments,
        property_equipment, less_accumulated_depreciation, intangible_assets,
        total_fixed_assets, deferred_income_tax, other_assets, total_assets,
        accounts_payable, short_term_loans, income_taxes_payable,
        accrued_salaries_and_wages, unearned_revenue,
        current_portion_of_long_term_debt, total_current_liabilities,
        long_term_debt, deferred_income_tax_liabilities,
        total_long_term_liabilities, owners_investment, retained_earnings,
        total_owners_equity, total_liabilities_and_owners_equity,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        NOW(), NOW()
      ) RETURNING *
    `;

    const params = [
      body.year,
      body.category,
      body.cash || null,
      body.accounts_receivable || null,
      body.inventory || null,
      body.prepaid_expenses || null,
      body.short_term_investments || null,
      body.total_current_assets || null,
      body.long_term_investments || null,
      body.property_equipment || null,
      body.less_accumulated_depreciation || null,
      body.intangible_assets || null,
      body.total_fixed_assets || null,
      body.deferred_income_tax || null,
      body.other_assets || null,
      body.total_assets || null,
      body.accounts_payable || null,
      body.short_term_loans || null,
      body.income_taxes_payable || null,
      body.accrued_salaries_and_wages || null,
      body.unearned_revenue || null,
      body.current_portion_of_long_term_debt || null,
      body.total_current_liabilities || null,
      body.long_term_debt || null,
      body.deferred_income_tax_liabilities || null,
      body.total_long_term_liabilities || null,
      body.owners_investment || null,
      body.retained_earnings || null,
      body.total_owners_equity || null,
      body.total_liabilities_and_owners_equity || null
    ];

    const result = await query(sql, params);

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating balance sheet entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}