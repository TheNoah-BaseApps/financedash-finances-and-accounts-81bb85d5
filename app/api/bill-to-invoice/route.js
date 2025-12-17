import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/bill-to-invoice:
 *   get:
 *     summary: Get all bill to invoice records
 *     description: Retrieve a list of all bill to invoice records with pagination support
 *     tags: [Bill to Invoice]
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
 *         description: List of bill to invoice records
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await query(
      'SELECT * FROM bill_to_invoice ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      count: result.rows.length 
    });
  } catch (error) {
    console.error('Error fetching bill to invoice records:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/bill-to-invoice:
 *   post:
 *     summary: Create a new bill to invoice record
 *     description: Create a new bill to invoice record with invoice details
 *     tags: [Bill to Invoice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice_id
 *               - date
 *               - customer_id
 *               - terms
 *               - bill_to
 *               - ship_to
 *               - description
 *               - quantity
 *               - unit_price
 *               - amount
 *               - tax_percentage
 *               - total
 *             properties:
 *               invoice_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               customer_id:
 *                 type: string
 *               terms:
 *                 type: string
 *               bill_to:
 *                 type: string
 *               ship_to:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               unit_price:
 *                 type: number
 *               amount:
 *                 type: number
 *               tax_percentage:
 *                 type: number
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Bill to invoice record created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      invoice_id,
      date,
      customer_id,
      terms,
      bill_to,
      ship_to,
      description,
      quantity,
      unit_price,
      amount,
      tax_percentage,
      total
    } = body;

    // Validation
    if (!invoice_id || !date || !customer_id || !terms || !bill_to || !ship_to || 
        !description || quantity === undefined || unit_price === undefined || 
        amount === undefined || tax_percentage === undefined || total === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO bill_to_invoice (
        invoice_id, date, customer_id, terms, bill_to, ship_to, description,
        quantity, unit_price, amount, tax_percentage, total, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) 
      RETURNING *`,
      [invoice_id, date, customer_id, terms, bill_to, ship_to, description, 
       quantity, unit_price, amount, tax_percentage, total]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bill to invoice record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}