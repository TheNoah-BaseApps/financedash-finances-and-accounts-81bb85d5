import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/income-statement/{id}:
 *   get:
 *     summary: Get income statement by ID
 *     description: Retrieve a specific income statement record
 *     tags: [Income Statement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Income statement ID
 *     responses:
 *       200:
 *         description: Successfully retrieved income statement
 *       404:
 *         description: Income statement not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM income_statement WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Income statement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching income statement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/income-statement/{id}:
 *   put:
 *     summary: Update income statement
 *     description: Update an existing income statement record
 *     tags: [Income Statement]
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
 *         description: Income statement not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

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
      `UPDATE income_statement SET
        year = $1, account_category = $2, sales_revenue = $3, service_revenue = $4,
        interest_revenue = $5, other_revenue = $6, total_revenues = $7,
        advertising = $8, bad_debt = $9, commissions = $10, cost_of_goods_sold = $11,
        depreciation = $12, employee_benefits = $13, furniture_and_equipment = $14,
        insurance = $15, interest_expense = $16, maintenance_and_repairs = $17,
        office_supplies = $18, payroll_taxes = $19, rent = $20,
        research_and_development = $21, salaries_and_wages = $22, software = $23,
        travel = $24, utilities = $25, web_hosting_and_domains = $26,
        other_expenses = $27, total_expenses = $28, net_income_before_taxes = $29,
        income_tax_expense = $30, income_from_continuing_operations = $31,
        net_income = $32, updated_at = now()
      WHERE id = $33 RETURNING *`,
      [
        year, account_category, sales_revenue, service_revenue, interest_revenue,
        other_revenue, total_revenues, advertising, bad_debt, commissions,
        cost_of_goods_sold, depreciation, employee_benefits, furniture_and_equipment,
        insurance, interest_expense, maintenance_and_repairs, office_supplies,
        payroll_taxes, rent, research_and_development, salaries_and_wages,
        software, travel, utilities, web_hosting_and_domains, other_expenses,
        total_expenses, net_income_before_taxes, income_tax_expense,
        income_from_continuing_operations, net_income, id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Income statement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating income statement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/income-statement/{id}:
 *   delete:
 *     summary: Delete income statement
 *     description: Delete an income statement record
 *     tags: [Income Statement]
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
 *         description: Income statement not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM income_statement WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Income statement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Income statement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting income statement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}