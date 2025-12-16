/**
 * @swagger
 * /api/accounts-receivable/{id}:
 *   put:
 *     summary: Update receivable
 *     tags: [Accounts Receivable]
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete receivable
 *     tags: [Accounts Receivable]
 *     responses:
 *       200:
 *         description: Deleted
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { requireAuth } from '@/lib/auth';
import { calculateBalanceDue, determineStatus } from '@/lib/calculations';
import { validatePayments, isValidUUID } from '@/lib/validation';
import { logUpdate, logDelete } from '@/lib/audit';

export async function PUT(request, { params }) {
  try {
    const user = await requireAuth(request);
    const { id } = params;

    if (!isValidUUID(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Get existing record
    const existingResult = await query(
      'SELECT * FROM accounts_receivable WHERE id = $1 AND user_id = $2',
      [id, user.userId]
    );

    if (!existingResult.rows || existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Receivable not found' },
        { status: 404 }
      );
    }

    const oldRecord = existingResult.rows[0];
    const body = await request.json();

    const {
      invoice_date,
      invoice_number,
      customer,
      terms,
      total_amount,
      date_due,
      payment1,
      payment2,
      payment3,
      payment4,
      payment5
    } = body;

    // Validate payments if total_amount is being updated
    if (total_amount) {
      const payments = [payment1, payment2, payment3, payment4, payment5];
      const paymentValidation = validatePayments(total_amount, payments);
      if (!paymentValidation.isValid) {
        return NextResponse.json(
          { success: false, error: paymentValidation.message },
          { status: 400 }
        );
      }
    }

    // Calculate balance and status
    const finalTotalAmount = total_amount || oldRecord.total_amount;
    const payments = [
      payment1 !== undefined ? payment1 : oldRecord.payment1,
      payment2 !== undefined ? payment2 : oldRecord.payment2,
      payment3 !== undefined ? payment3 : oldRecord.payment3,
      payment4 !== undefined ? payment4 : oldRecord.payment4,
      payment5 !== undefined ? payment5 : oldRecord.payment5
    ];
    
    const balance_due = calculateBalanceDue(finalTotalAmount, payments);
    const finalDueDate = date_due || oldRecord.date_due;
    const status = determineStatus(finalDueDate, balance_due);

    // Update record
    const result = await query(
      `UPDATE accounts_receivable SET
        invoice_date = COALESCE($1, invoice_date),
        invoice_number = COALESCE($2, invoice_number),
        customer = COALESCE($3, customer),
        terms = COALESCE($4, terms),
        total_amount = COALESCE($5, total_amount),
        date_due = COALESCE($6, date_due),
        balance_due = $7,
        payment1 = COALESCE($8, payment1),
        payment2 = COALESCE($9, payment2),
        payment3 = COALESCE($10, payment3),
        payment4 = COALESCE($11, payment4),
        payment5 = COALESCE($12, payment5),
        status = $13,
        updated_at = NOW()
      WHERE id = $14 AND user_id = $15
      RETURNING *`,
      [
        invoice_date, invoice_number, customer, terms, total_amount, date_due,
        balance_due,
        payment1, payment2, payment3, payment4, payment5,
        status, id, user.userId
      ]
    );

    const updatedRecord = result.rows[0];

    // Log audit
    await logUpdate(user.userId, 'accounts_receivable', id, oldRecord, updatedRecord);

    return NextResponse.json(
      {
        success: true,
        data: updatedRecord,
        message: 'Receivable updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/accounts-receivable/[id]:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update receivable' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth(request);
    const { id } = params;

    if (!isValidUUID(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Get existing record for audit
    const existingResult = await query(
      'SELECT * FROM accounts_receivable WHERE id = $1 AND user_id = $2',
      [id, user.userId]
    );

    if (!existingResult.rows || existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Receivable not found' },
        { status: 404 }
      );
    }

    const oldRecord = existingResult.rows[0];

    // Delete record
    await query(
      'DELETE FROM accounts_receivable WHERE id = $1 AND user_id = $2',
      [id, user.userId]
    );

    // Log audit
    await logDelete(user.userId, 'accounts_receivable', id, oldRecord);

    return NextResponse.json(
      {
        success: true,
        message: 'Receivable deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/accounts-receivable/[id]:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete receivable' },
      { status: 500 }
    );
  }
}