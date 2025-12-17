import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/expense-report:
 *   get:
 *     summary: Get all expense reports
 *     description: Retrieve all expense report records with pagination
 *     tags: [Expense Report]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: string
 *         description: Filter by employee ID
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Successfully retrieved expense reports
 *       500:
 *         description: Internal server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const employee_id = searchParams.get('employee_id');
    const department = searchParams.get('department');

    let queryText = 'SELECT * FROM expense_report';
    const params = [];
    const conditions = [];
    
    if (employee_id) {
      conditions.push(`employee_id = $${params.length + 1}`);
      params.push(employee_id);
    }
    
    if (department) {
      conditions.push(`department = $${params.length + 1}`);
      params.push(department);
    }
    
    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }
    
    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching expense reports:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/expense-report:
 *   post:
 *     summary: Create a new expense report
 *     description: Create a new expense report record
 *     tags: [Expense Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_name
 *               - employee_id
 *               - reimbursement_address
 *               - phone
 *               - department
 *               - manager
 *               - manager_phone
 *               - destination
 *               - purpose
 *               - from_date
 *               - to_date
 *               - expense_date
 *               - description
 *             properties:
 *               employee_name:
 *                 type: string
 *               employee_id:
 *                 type: string
 *               reimbursement_address:
 *                 type: string
 *               phone:
 *                 type: string
 *               department:
 *                 type: string
 *               manager:
 *                 type: string
 *               manager_phone:
 *                 type: string
 *               destination:
 *                 type: string
 *               purpose:
 *                 type: string
 *               from_date:
 *                 type: string
 *                 format: date-time
 *               to_date:
 *                 type: string
 *                 format: date-time
 *               expense_date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               air_and_transport:
 *                 type: number
 *               lodging:
 *                 type: number
 *               fuel:
 *                 type: number
 *               phone_expenses:
 *                 type: number
 *               meals_and_tips:
 *                 type: number
 *               entertainment:
 *                 type: number
 *               other_expenses:
 *                 type: number
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Expense report created successfully
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const requiredFields = [
      'employee_name', 'employee_id', 'reimbursement_address', 'phone',
      'department', 'manager', 'manager_phone', 'destination', 'purpose',
      'from_date', 'to_date', 'expense_date', 'description'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const {
      employee_name, employee_id, reimbursement_address, phone, department,
      manager, manager_phone, destination, purpose, from_date, to_date,
      expense_date, description, air_and_transport, lodging, fuel,
      phone_expenses, meals_and_tips, entertainment, other_expenses, total
    } = body;

    const result = await query(
      `INSERT INTO expense_report (
        employee_name, employee_id, reimbursement_address, phone, department,
        manager, manager_phone, destination, purpose, from_date, to_date,
        expense_date, description, air_and_transport, lodging, fuel,
        phone_expenses, meals_and_tips, entertainment, other_expenses, total
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      ) RETURNING *`,
      [
        employee_name, employee_id, reimbursement_address, phone, department,
        manager, manager_phone, destination, purpose, from_date, to_date,
        expense_date, description, air_and_transport, lodging, fuel,
        phone_expenses, meals_and_tips, entertainment, other_expenses, total
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating expense report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}