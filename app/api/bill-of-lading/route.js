import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/bill-of-lading:
 *   get:
 *     summary: Get all bill of lading records
 *     description: Retrieve a list of all bill of lading records with pagination support
 *     tags: [Bill of Lading]
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
 *         description: List of bill of lading records
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
      'SELECT * FROM bill_of_lading ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      count: result.rows.length 
    });
  } catch (error) {
    console.error('Error fetching bill of lading records:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/bill-of-lading:
 *   post:
 *     summary: Create a new bill of lading record
 *     description: Create a new bill of lading record with shipping and packaging details
 *     tags: [Bill of Lading]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number_shipping_units
 *               - packaging_description
 *               - code
 *               - weight_subject_to_correction
 *               - dimensional_weight
 *               - amount
 *             properties:
 *               number_shipping_units:
 *                 type: integer
 *               packaging_description:
 *                 type: string
 *               code:
 *                 type: string
 *               weight_subject_to_correction:
 *                 type: number
 *               dimensional_weight:
 *                 type: number
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Bill of lading record created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      number_shipping_units,
      packaging_description,
      code,
      weight_subject_to_correction,
      dimensional_weight,
      amount
    } = body;

    // Validation
    if (number_shipping_units === undefined || !packaging_description || !code || 
        weight_subject_to_correction === undefined || dimensional_weight === undefined || 
        amount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO bill_of_lading (
        number_shipping_units, packaging_description, code, weight_subject_to_correction,
        dimensional_weight, amount, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
      [number_shipping_units, packaging_description, code, weight_subject_to_correction,
       dimensional_weight, amount]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bill of lading record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}