import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/budget-management:
 *   get:
 *     summary: Get all budget entries
 *     description: Retrieve all budget management entries with pagination and filtering
 *     tags: [Budget Management]
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
 *       - in: query
 *         name: financial_year
 *         schema:
 *           type: string
 *         description: Filter by financial year
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: budget_status
 *         schema:
 *           type: string
 *         description: Filter by budget status
 *     responses:
 *       200:
 *         description: List of budget entries retrieved successfully
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
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const financial_year = searchParams.get('financial_year');
    const department = searchParams.get('department');
    const budget_status = searchParams.get('budget_status');

    let queryText = 'SELECT * FROM budget_management WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    if (financial_year) {
      paramCount++;
      queryText += ` AND financial_year = $${paramCount}`;
      queryParams.push(financial_year);
    }

    if (department) {
      paramCount++;
      queryText += ` AND department = $${paramCount}`;
      queryParams.push(department);
    }

    if (budget_status) {
      paramCount++;
      queryText += ` AND budget_status = $${paramCount}`;
      queryParams.push(budget_status);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM budget_management WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (financial_year) {
      countParamCount++;
      countQuery += ` AND financial_year = $${countParamCount}`;
      countParams.push(financial_year);
    }

    if (department) {
      countParamCount++;
      countQuery += ` AND department = $${countParamCount}`;
      countParams.push(department);
    }

    if (budget_status) {
      countParamCount++;
      countQuery += ` AND budget_status = $${countParamCount}`;
      countParams.push(budget_status);
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching budget entries:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/budget-management:
 *   post:
 *     summary: Create a new budget entry
 *     description: Create a new budget management entry with automatic calculation of total_utilised, balance_available, and utilisation_percent
 *     tags: [Budget Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - budget_id
 *               - financial_year
 *               - department
 *               - budget_category
 *               - budget_date
 *               - budget_owner
 *               - original_budget
 *               - budget_status
 *             properties:
 *               budget_id:
 *                 type: string
 *                 description: Unique budget identifier
 *               financial_year:
 *                 type: string
 *                 description: Financial year (e.g., "2024-2025")
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
 *                 description: Budget allocation date
 *               budget_owner:
 *                 type: string
 *                 description: Budget owner/responsible person
 *               original_budget:
 *                 type: number
 *                 description: Original allocated budget amount
 *               revised_budget:
 *                 type: number
 *                 description: Revised budget amount (defaults to original_budget if not provided)
 *               actual_spend_ytd:
 *                 type: number
 *                 description: Actual spending year-to-date (defaults to 0)
 *               committed_spend:
 *                 type: number
 *                 description: Committed/planned spending (defaults to 0)
 *               budget_status:
 *                 type: string
 *                 enum: [Active, On Hold, Exceeded, Closed]
 *                 description: Current budget status
 *     responses:
 *       201:
 *         description: Budget entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Created budget entry with calculated fields
 *       400:
 *         description: Invalid input or missing required fields
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Validation
    const requiredFields = ['budget_id', 'financial_year', 'department', 'budget_category', 'budget_date', 'budget_owner', 'original_budget', 'budget_status'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

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

    // Calculate fields
    const actualSpend = parseFloat(actual_spend_ytd || 0);
    const committedSpend = parseFloat(committed_spend || 0);
    const revisedBudgetValue = parseFloat(revised_budget || original_budget);
    
    const total_utilised = actualSpend + committedSpend;
    const balance_available = revisedBudgetValue - total_utilised;
    const utilisation_percent = revisedBudgetValue > 0 ? (total_utilised / revisedBudgetValue) * 100 : 0;

    const result = await query(
      `INSERT INTO budget_management (
        budget_id, financial_year, department, budget_category, sub_category,
        budget_date, budget_owner, original_budget, revised_budget,
        actual_spend_ytd, committed_spend, total_utilised, balance_available,
        utilisation_percent, budget_status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING *`,
      [
        budget_id,
        financial_year,
        department,
        budget_category,
        sub_category || null,
        budget_date,
        budget_owner,
        parseFloat(original_budget),
        revisedBudgetValue,
        actualSpend,
        committedSpend,
        total_utilised,
        balance_available,
        utilisation_percent,
        budget_status
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating budget entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}