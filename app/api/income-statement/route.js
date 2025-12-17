import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/income-statement:
 *   get:
 *     summary: Get all income statements
 *     description: Retrieve all income statement records with pagination
 *     tags: [Income Statement]
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
 *         name: year
 *         schema:
 *           type: string
 *         description: Filter by year
 *     responses:
 *       200:
 *         description: Successfully retrieved income statements
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
 *         description: Internal server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const year = searchParams.get('year');

    let queryText = 'SELECT * FROM income_statement';
    const params = [];
    
    if (year) {
      queryText += ' WHERE year = $1';
      params.push(year);
      queryText += ' ORDER BY created_at DESC LIMIT $2 OFFSET $3';
      params.push(limit, offset);
    } else {
      queryText += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
      params.push(limit, offset);
    }

    const result = await query(queryText, params);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching income statements:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/income-statement:
 *   post:
 *     summary: Create a new income statement
 *     description: Create a new income statement record
 *     tags: [Income Statement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - account_category
 *             properties:
 *               year:
 *                 type: string
 *               account_category:
 *                 type: string
 *               sales_revenue:
 *                 type: number
 *               service_revenue:
 *                 type: number
 *               interest_revenue:
 *                 type: number
 *               other_revenue:
 *                 type: number
 *               total_revenues:
 *                 type: number
 *               advertising:
 *                 type: number
 *               bad_debt:
 *                 type: number
 *               commissions:
 *                 type: number
 *               cost_of_goods_sold:
 *                 type: number
 *               depreciation:
 *                 type: number
 *               employee_benefits:
 *                 type: number
 *               furniture_and_equipment:
 *                 type: number
 *               insurance:
 *                 type: number
 *               interest_expense:
 *                 type: number
 *               maintenance_and_repairs:
 *                 type: number
 *               office_supplies:
 *                 type: number
 *               payroll_taxes:
 *                 type: number
 *               rent:
 *                 type: number
 *               research_and_development:
 *                 type: number
 *               salaries_and_wages:
 *                 type: number
 *               software:
 *                 type: number
 *               travel:
 *                 type: number
 *               utilities:
 *                 type: number
 *               web_hosting_and_domains:
 *                 type: number
 *               other_expenses:
 *                 type: number
 *               total_expenses:
 *                 type: number
 *               net_income_before_taxes:
 *                 type: number
 *               income_tax_expense:
 *                 type: number
 *               income_from_continuing_operations:
 *                 type: number
 *               net_income:
 *                 type: number
 *     responses:
 *       201:
 *         description: Income statement created successfully
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.year || !body.account_category) {
      return NextResponse.json(
        { success: false, error: 'Year and account category are required' },
        { status: 400 }
      );
    }

    const {
      year, account_category, sales_revenue, service_revenue, interest_revenue,
      other_revenue, total_revenues, advertising, bad_debt, commissions,
      cost_of_goods_sold, depreciation, employee_benefits, furniture_and_equipment,
      insurance, interest_expense, maintenance_and_repairs, office_supplies,
      payroll_taxes, rent, research_and_development, salaries_and_wages,
      software, travel, utilities, web_hosting_and_domains, other_expenses,
      total_expenses, net_income_before_taxes, income_tax_expense,
      income_from_continuing_operations, net_income
    } = body;

    const result = await query(
      `INSERT INTO income_statement (
        year, account_category, sales_revenue, service_revenue, interest_revenue,
        other_revenue, total_revenues, advertising, bad_debt, commissions,
        cost_of_goods_sold, depreciation, employee_benefits, furniture_and_equipment,
        insurance, interest_expense, maintenance_and_repairs, office_supplies,
        payroll_taxes, rent, research_and_development, salaries_and_wages,
        software, travel, utilities, web_hosting_and_domains, other_expenses,
        total_expenses, net_income_before_taxes, income_tax_expense,
        income_from_continuing_operations, net_income
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32
      ) RETURNING *`,
      [
        year, account_category, sales_revenue, service_revenue, interest_revenue,
        other_revenue, total_revenues, advertising, bad_debt, commissions,
        cost_of_goods_sold, depreciation, employee_benefits, furniture_and_equipment,
        insurance, interest_expense, maintenance_and_repairs, office_supplies,
        payroll_taxes, rent, research_and_development, salaries_and_wages,
        software, travel, utilities, web_hosting_and_domains, other_expenses,
        total_expenses, net_income_before_taxes, income_tax_expense,
        income_from_continuing_operations, net_income
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating income statement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}