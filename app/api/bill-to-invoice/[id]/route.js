import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/bill-to-invoice/{id}:
 *   get:
 *     summary: Get a bill to invoice record by ID
 *     description: Retrieve a specific bill to invoice record by its ID
 *     tags: [Bill to Invoice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill to invoice record ID
 *     responses:
 *       200:
 *         description: Bill to invoice record details
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM bill_to_invoice WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching bill to invoice record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/bill-to-invoice/{id}:
 *   put:
 *     summary: Update a bill to invoice record
 *     description: Update an existing bill to invoice record by its ID
 *     tags: [Bill to Invoice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill to invoice record ID
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

    const result = await query(
      `UPDATE bill_to_invoice SET 
        invoice_id = $1, date = $2, customer_id = $3, terms = $4, bill_to = $5,
        ship_to = $6, description = $7, quantity = $8, unit_price = $9, amount = $10,
        tax_percentage = $11, total = $12, updated_at = NOW()
      WHERE id = $13 RETURNING *`,
      [invoice_id, date, customer_id, terms, bill_to, ship_to, description,
       quantity, unit_price, amount, tax_percentage, total, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating bill to invoice record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/bill-to-invoice/{id}:
 *   delete:
 *     summary: Delete a bill to invoice record
 *     description: Delete a bill to invoice record by its ID
 *     tags: [Bill to Invoice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill to invoice record ID
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
    const result = await query('DELETE FROM bill_to_invoice WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill to invoice record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}