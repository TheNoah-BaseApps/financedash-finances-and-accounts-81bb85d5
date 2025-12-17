import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/bill-of-lading/{id}:
 *   get:
 *     summary: Get a bill of lading record by ID
 *     description: Retrieve a specific bill of lading record by its ID
 *     tags: [Bill of Lading]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill of lading record ID
 *     responses:
 *       200:
 *         description: Bill of lading record details
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM bill_of_lading WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching bill of lading record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/bill-of-lading/{id}:
 *   put:
 *     summary: Update a bill of lading record
 *     description: Update an existing bill of lading record by its ID
 *     tags: [Bill of Lading]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill of lading record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      number_shipping_units,
      packaging_description,
      code,
      weight_subject_to_correction,
      dimensional_weight,
      amount
    } = body;

    const result = await query(
      `UPDATE bill_of_lading SET 
        number_shipping_units = $1, packaging_description = $2, code = $3,
        weight_subject_to_correction = $4, dimensional_weight = $5, amount = $6,
        updated_at = NOW()
      WHERE id = $7 RETURNING *`,
      [number_shipping_units, packaging_description, code, weight_subject_to_correction,
       dimensional_weight, amount, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating bill of lading record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/bill-of-lading/{id}:
 *   delete:
 *     summary: Delete a bill of lading record
 *     description: Delete a bill of lading record by its ID
 *     tags: [Bill of Lading]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill of lading record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM bill_of_lading WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill of lading record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}