import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/budget-management/{id}:
 *   get:
 *     summary: Get a specific budget entry
 *     description: Retrieve a single budget entry by ID
 *     tags: [Budget Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Budget entry ID
 *     responses:
 *       200:
 *         description: Budget entry retrieved successfully
 *       404:
 *         description: Budget entry not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      'SELECT * FROM budget_management WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Budget entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching budget entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/budget-management/{id}:
 *   put:
 *     summary: Update a budget entry
 *     description: Update an existing budget entry
 *     tags: [Budget Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Budget entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budget_id:
 *                 type: string
 *               financial_year:
 *                 type: string
 *               department:
 *                 type: string
 *               budget_category:
 *                 type: string
 *               sub_category:
 *                 type: string
 *               budget_date:
 *                 type: string
 *                 format: date-time
 *               budget_owner:
 *                 type: string
 *               original_budget:
 *                 type: number
 *               revised_budget:
 *                 type: number
 *               actual_spend_ytd:
 *                 type: number
 *               committed_spend:
 *                 type: number
 *               total_utilised:
 *                 type: number
 *               balance_available:
 *                 type: number
 *               utilisation_percent:
 *                 type: number
 *               budget_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Budget entry updated successfully
 *       404:
 *         description: Budget entry not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      budget_id,
      financial_year,
      department,
      budget_category,
      sub_category,
      budget_date,
      budget_owner,
      original_budget,
      revised_budget,
      actual_spend_ytd,
      committed_spend,
      total_utilised,
      balance_available,
      utilisation_percent,
      budget_status
    } = body;

    const result = await query(
      `UPDATE budget_management SET
        budget_id = COALESCE($1, budget_id),
        financial_year = COALESCE($2, financial_year),
        department = COALESCE($3, department),
        budget_category = COALESCE($4, budget_category),
        sub_category = COALESCE($5, sub_category),
        budget_date = COALESCE($6, budget_date),
        budget_owner = COALESCE($7, budget_owner),
        original_budget = COALESCE($8, original_budget),
        revised_budget = COALESCE($9, revised_budget),
        actual_spend_ytd = COALESCE($10, actual_spend_ytd),
        committed_spend = COALESCE($11, committed_spend),
        total_utilised = COALESCE($12, total_utilised),
        balance_available = COALESCE($13, balance_available),
        utilisation_percent = COALESCE($14, utilisation_percent),
        budget_status = COALESCE($15, budget_status),
        updated_at = NOW()
      WHERE id = $16
      RETURNING *`,
      [
        budget_id,
        financial_year,
        department,
        budget_category,
        sub_category,
        budget_date,
        budget_owner,
        original_budget,
        revised_budget,
        actual_spend_ytd,
        committed_spend,
        total_utilised,
        balance_available,
        utilisation_percent,
        budget_status,
        id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Budget entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating budget entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/budget-management/{id}:
 *   delete:
 *     summary: Delete a budget entry
 *     description: Delete a budget entry by ID
 *     tags: [Budget Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Budget entry ID
 *     responses:
 *       200:
 *         description: Budget entry deleted successfully
 *       404:
 *         description: Budget entry not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      'DELETE FROM budget_management WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Budget entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Budget entry deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting budget entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}