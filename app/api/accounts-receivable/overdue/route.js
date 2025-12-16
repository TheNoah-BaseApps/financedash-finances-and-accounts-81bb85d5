/**
 * @swagger
 * /api/accounts-receivable/overdue:
 *   get:
 *     summary: Get overdue receivables
 *     tags: [Accounts Receivable]
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
      `SELECT * FROM accounts_receivable
       WHERE user_id = $1 AND status = 'overdue' AND balance_due > 0
       ORDER BY date_due ASC, balance_due DESC`,
      [user.userId]
    );

    const overdueReceivables = (result.rows || []).map(receivable => ({
      ...receivable,
      days_overdue: calculateDaysOverdue(receivable.date_due)
    }));

    return NextResponse.json(
      {
        success: true,
        data: overdueReceivables
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/accounts-receivable/overdue:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch overdue receivables' },
      { status: 500 }
    );
  }
}