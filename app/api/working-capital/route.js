import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/working-capital:
 *   get:
 *     summary: Get all working capital records
 *     description: Retrieve a list of all working capital records with pagination
 *     tags: [Working Capital]
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
 *         description: List of working capital records retrieved successfully
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await query(
      `SELECT * FROM working_capital 
       ORDER BY date DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      count: result.rows.length 
    });
  } catch (error) {
    console.error('Error fetching working capital records:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/working-capital:
 *   post:
 *     summary: Create a new working capital record
 *     description: Create a new working capital record with cash conversion cycle metrics
 *     tags: [Working Capital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wc_id
 *               - wc_name
 *               - date
 *               - financial_year
 *               - inventory_value
 *               - trade_receivables
 *               - other_receivables
 *               - trade_payables
 *               - other_payables
 *               - net_working_capital
 *               - debtors_days
 *               - creditors_days
 *               - cash_conversion_cycle
 *               - working_capital_ratio
 *             properties:
 *               wc_id:
 *                 type: string
 *               wc_name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               financial_year:
 *                 type: string
 *               inventory_value:
 *                 type: number
 *               trade_receivables:
 *                 type: number
 *               other_receivables:
 *                 type: number
 *               trade_payables:
 *                 type: number
 *               other_payables:
 *                 type: number
 *               net_working_capital:
 *                 type: number
 *               debtors_days:
 *                 type: integer
 *               creditors_days:
 *                 type: integer
 *               cash_conversion_cycle:
 *                 type: integer
 *               working_capital_ratio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Working capital record created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      wc_id,
      wc_name,
      date,
      financial_year,
      inventory_value,
      trade_receivables,
      other_receivables,
      trade_payables,
      other_payables,
      net_working_capital,
      debtors_days,
      creditors_days,
      cash_conversion_cycle,
      working_capital_ratio
    } = body;

    if (!wc_id || !wc_name || !financial_year) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO working_capital (
        wc_id, wc_name, date, financial_year, inventory_value,
        trade_receivables, other_receivables, trade_payables, other_payables,
        net_working_capital, debtors_days, creditors_days,
        cash_conversion_cycle, working_capital_ratio, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
      RETURNING *`,
      [
        wc_id, wc_name, date, financial_year, inventory_value,
        trade_receivables, other_receivables, trade_payables, other_payables,
        net_working_capital, debtors_days, creditors_days,
        cash_conversion_cycle, working_capital_ratio
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating working capital record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}