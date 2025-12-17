import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/expense-report/{id}:
 *   get:
 *     summary: Get expense report by ID
 *     description: Retrieve a specific expense report record
 *     tags: [Expense Report]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved expense report
 *       404:
 *         description: Expense report not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM expense_report WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Expense report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching expense report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/expense-report/{id}:
 *   put:
 *     summary: Update expense report
 *     description: Update an existing expense report record
 *     tags: [Expense Report]
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
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Expense report not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      employee_name, employee_id, reimbursement_address, phone, department,
      manager, manager_phone, destination, purpose, from_date, to_date,
      expense_date, description, air_and_transport, lodging, fuel,
      phone_expenses, meals_and_tips, entertainment, other_expenses, total
    } = body;

    const result = await query(
      `UPDATE expense_report SET
        employee_name = $1, employee_id = $2, reimbursement_address = $3,
        phone = $4, department = $5, manager = $6, manager_phone = $7,
        destination = $8, purpose = $9, from_date = $10, to_date = $11,
        expense_date = $12, description = $13, air_and_transport = $14,
        lodging = $15, fuel = $16, phone_expenses = $17, meals_and_tips = $18,
        entertainment = $19, other_expenses = $20, total = $21,
        updated_at = now()
      WHERE id = $22 RETURNING *`,
      [
        employee_name, employee_id, reimbursement_address, phone, department,
        manager, manager_phone, destination, purpose, from_date, to_date,
        expense_date, description, air_and_transport, lodging, fuel,
        phone_expenses, meals_and_tips, entertainment, other_expenses, total, id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Expense report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating expense report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/expense-report/{id}:
 *   delete:
 *     summary: Delete expense report
 *     description: Delete an expense report record
 *     tags: [Expense Report]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Expense report not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM expense_report WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Expense report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Expense report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting expense report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}