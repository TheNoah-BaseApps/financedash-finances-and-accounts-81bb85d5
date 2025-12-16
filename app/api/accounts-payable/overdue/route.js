/**
 * @swagger
 * /api/accounts-payable/overdue:
 *   get:
 *     summary: Get overdue payables
 *     tags: [Accounts Payable]
 *     responses:
 *       200:
 *         description: Success
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { requireAuth } from '@/lib/auth';
import { calculateDaysOverdue } from '@/lib/calculations';

export async function GET(request) {
  try {
    const user = await requireAuth(request);

    const result = await query(
      `SELECT * FROM accounts_payable
       WHERE user_id = $1 AND status = 'overdue' AND balance_due > 0
       ORDER BY due_date ASC, balance_due DESC`,
      [user.userId]
    );

    const overduePayables = (result.rows || []).map(payable => ({
      ...payable,
      days_overdue: calculateDaysOverdue(payable.due_date)
    }));

    return NextResponse.json(
      {
        success: true,
        data: overduePayables
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/accounts-payable/overdue:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch overdue payables' },
      { status: 500 }
    );
  }
}