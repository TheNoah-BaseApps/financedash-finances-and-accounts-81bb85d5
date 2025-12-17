import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/finance-reporting:
 *   get:
 *     summary: Get all finance reports
 *     description: Retrieve a list of all finance reports with pagination
 *     tags: [Finance Reporting]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: List of finance reports retrieved successfully
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await query(
      `SELECT * FROM finance_reporting 
       ORDER BY report_date DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      count: result.rows.length 
    });
  } catch (error) {
    console.error('Error fetching finance reports:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/finance-reporting:
 *   post:
 *     summary: Create a new finance report
 *     description: Create a new finance report with financial metrics
 *     tags: [Finance Reporting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - report_id
 *               - financial_year
 *               - report_type
 *               - report_date
 *               - revenue
 *               - gross_profit
 *               - ebitda
 *               - net_profit
 *               - cash_balance
 *               - debtors_days
 *               - expenses
 *               - assets
 *               - liabilities
 *               - equity
 *               - report_status
 *             properties:
 *               report_id:
 *                 type: string
 *               financial_year:
 *                 type: string
 *               report_type:
 *                 type: string
 *               report_date:
 *                 type: string
 *                 format: date-time
 *               revenue:
 *                 type: number
 *               gross_profit:
 *                 type: number
 *               ebitda:
 *                 type: number
 *               net_profit:
 *                 type: number
 *               cash_balance:
 *                 type: number
 *               debtors_days:
 *                 type: integer
 *               expenses:
 *                 type: number
 *               assets:
 *                 type: number
 *               liabilities:
 *                 type: number
 *               equity:
 *                 type: number
 *               report_status:
 *                 type: string
 *               approved_by:
 *                 type: string
 *               approval_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Finance report created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      report_id,
      financial_year,
      report_type,
      report_date,
      revenue,
      gross_profit,
      ebitda,
      net_profit,
      cash_balance,
      debtors_days,
      expenses,
      assets,
      liabilities,
      equity,
      report_status,
      approved_by,
      approval_date
    } = body;

    if (!report_id || !financial_year || !report_type || !report_status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO finance_reporting (
        report_id, financial_year, report_type, report_date,
        revenue, gross_profit, ebitda, net_profit, cash_balance,
        debtors_days, expenses, assets, liabilities, equity,
        report_status, approved_by, approval_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
      RETURNING *`,
      [
        report_id, financial_year, report_type, report_date,
        revenue, gross_profit, ebitda, net_profit, cash_balance,
        debtors_days, expenses, assets, liabilities, equity,
        report_status, approved_by, approval_date
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating finance report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}