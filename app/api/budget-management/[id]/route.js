import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/budget-management/{id}:
 *   get:
 *     summary: Get a specific budget entry
 *     description: Retrieve a single budget entry by ID with all budget details
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     budget_id:
 *                       type: string
 *                     financial_year:
 *                       type: string
 *                     department:
 *                       type: string
 *                     budget_category:
 *                       type: string
 *                     sub_category:
 *                       type: string
 *                     budget_date:
 *                       type: string
 *                       format: date-time
 *                     budget_owner:
 *                       type: string
 *                     original_budget:
 *                       type: number
 *                     revised_budget:
 *                       type: number
 *                     actual_spend_ytd:
 *                       type: number
 *                     committed_spend:
 *                       type: number
 *                     total_utilised:
 *                       type: number
 *                     balance_available:
 *                       type: number
 *                     utilisation_percent:
 *                       type: number
 *                     budget_status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Budget entry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      console.error('GET budget entry: Missing ID parameter');
      return NextResponse.json(
        { success: false, error: 'Budget entry ID is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT * FROM budget_management WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      console.error(`GET budget entry: Budget entry with ID ${id} not found`);
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
 *     description: Update an existing budget entry with automatic recalculation of total_utilised, balance_available, and utilisation_percent
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
 *                 description: Unique budget identifier
 *               financial_year:
 *                 type: string
 *                 description: Financial year (e.g., 2024-2025)
 *               department:
 *                 type: string
 *                 description: Department name
 *               budget_category:
 *                 type: string
 *                 description: Budget category
 *               sub_category:
 *                 type: string
 *                 description: Budget sub-category
 *               budget_date:
 *                 type: string
 *                 format: date-time
 *                 description: Budget date
 *               budget_owner:
 *                 type: string
 *                 description: Budget owner name
 *               original_budget:
 *                 type: number
 *                 description: Original allocated budget
 *               revised_budget:
 *                 type: number
 *                 description: Revised budget amount
 *               actual_spend_ytd:
 *                 type: number
 *                 description: Actual spend year-to-date
 *               committed_spend:
 *                 type: number
 *                 description: Committed spend amount
 *               budget_status:
 *                 type: string
 *                 description: Budget status (Active, Exhausted, etc.)
 *     responses:
 *       200:
 *         description: Budget entry updated successfully with recalculated values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     budget_id:
 *                       type: string
 *                     financial_year:
 *                       type: string
 *                     department:
 *                       type: string
 *                     budget_category:
 *                       type: string
 *                     sub_category:
 *                       type: string
 *                     budget_date:
 *                       type: string
 *                       format: date-time
 *                     budget_owner:
 *                       type: string
 *                     original_budget:
 *                       type: number
 *                     revised_budget:
 *                       type: number
 *                     actual_spend_ytd:
 *                       type: number
 *                     committed_spend:
 *                       type: number
 *                     total_utilised:
 *                       type: number
 *                     balance_available:
 *                       type: number
 *                     utilisation_percent:
 *                       type: number
 *                     budget_status:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       404:
 *         description: Budget entry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      console.error('PUT budget entry: Missing ID parameter');
      return NextResponse.json(
        { success: false, error: 'Budget entry ID is required' },
        { status: 400 }
      );
    }

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
      budget_status
    } = body;

    // First, check if the budget entry exists
    const existingResult = await query(
      'SELECT * FROM budget_management WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      console.error(`PUT budget entry: Budget entry with ID ${id} not found`);
      return NextResponse.json(
        { success: false, error: 'Budget entry not found' },
        { status: 404 }
      );
    }

    const existing = existingResult.rows[0];

    // Calculate derived fields with recalculation logic
    // Use updated values if provided, otherwise use existing values
    const updatedActualSpend = actual_spend_ytd !== undefined ? actual_spend_ytd : existing.actual_spend_ytd;
    const updatedCommittedSpend = committed_spend !== undefined ? committed_spend : existing.committed_spend;
    const updatedRevisedBudget = revised_budget !== undefined ? revised_budget : existing.revised_budget;

    // Recalculate total_utilised = actual_spend_ytd + committed_spend
    const calculatedTotalUtilised = (updatedActualSpend || 0) + (updatedCommittedSpend || 0);

    // Recalculate balance_available = revised_budget - total_utilised
    const calculatedBalanceAvailable = (updatedRevisedBudget || 0) - calculatedTotalUtilised;

    // Recalculate utilisation_percent = (total_utilised / revised_budget) * 100
    const calculatedUtilisationPercent = updatedRevisedBudget > 0 
      ? (calculatedTotalUtilised / updatedRevisedBudget) * 100 
      : 0;

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
        total_utilised = $12,
        balance_available = $13,
        utilisation_percent = $14,
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
        calculatedTotalUtilised,
        calculatedBalanceAvailable,
        calculatedUtilisationPercent,
        budget_status,
        id
      ]
    );

    if (result.rows.length === 0) {
      console.error(`PUT budget entry: Failed to update budget entry with ID ${id}`);
      return NextResponse.json(
        { success: false, error: 'Failed to update budget entry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating budget entry:', error);
    console.error('Error stack:', error.stack);
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
 *     description: Permanently delete a budget entry by ID from the database
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: Deleted budget entry data
 *       400:
 *         description: Bad request - missing ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       404:
 *         description: Budget entry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      console.error('DELETE budget entry: Missing ID parameter');
      return NextResponse.json(
        { success: false, error: 'Budget entry ID is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'DELETE FROM budget_management WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      console.error(`DELETE budget entry: Budget entry with ID ${id} not found`);
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
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}