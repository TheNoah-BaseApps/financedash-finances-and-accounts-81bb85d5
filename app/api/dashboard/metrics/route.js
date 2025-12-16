/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Get key financial metrics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Success
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await requireAuth(request);

    // Get payables metrics
    const payablesResult = await query(
      `SELECT 
        COUNT(*) as total_count,
        SUM(balance_due) as total_balance,
        SUM(CASE WHEN status = 'overdue' THEN balance_due ELSE 0 END) as overdue_balance,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count
       FROM accounts_payable
       WHERE user_id = $1`,
      [user.userId]
    );

    // Get receivables metrics
    const receivablesResult = await query(
      `SELECT 
        COUNT(*) as total_count,
        SUM(balance_due) as total_balance,
        SUM(CASE WHEN status = 'overdue' THEN balance_due ELSE 0 END) as overdue_balance,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count
       FROM accounts_receivable
       WHERE user_id = $1`,
      [user.userId]
    );

    // Get cash flow metrics
    const cashFlowResult = await query(
      `SELECT 
        AVG(month_ending_cash_position) as avg_cash_position,
        MIN(month_ending_cash_position) as min_cash_position,
        MAX(month_ending_cash_position) as max_cash_position,
        SUM(net_cash_change) as total_net_change
       FROM cash_flow_forecast
       WHERE user_id = $1`,
      [user.userId]
    );

    const payables = payablesResult.rows?.[0] || {};
    const receivables = receivablesResult.rows?.[0] || {};
    const cashFlow = cashFlowResult.rows?.[0] || {};

    const metrics = {
      accounts_payable: {
        total_count: parseInt(payables.total_count) || 0,
        total_balance: parseFloat(payables.total_balance) || 0,
        overdue_balance: parseFloat(payables.overdue_balance) || 0,
        overdue_count: parseInt(payables.overdue_count) || 0,
        overdue_percentage: payables.total_count > 0
          ? ((parseInt(payables.overdue_count) || 0) / parseInt(payables.total_count)) * 100
          : 0
      },
      accounts_receivable: {
        total_count: parseInt(receivables.total_count) || 0,
        total_balance: parseFloat(receivables.total_balance) || 0,
        overdue_balance: parseFloat(receivables.overdue_balance) || 0,
        overdue_count: parseInt(receivables.overdue_count) || 0,
        overdue_percentage: receivables.total_count > 0
          ? ((parseInt(receivables.overdue_count) || 0) / parseInt(receivables.total_count)) * 100
          : 0
      },
      cash_flow: {
        avg_cash_position: parseFloat(cashFlow.avg_cash_position) || 0,
        min_cash_position: parseFloat(cashFlow.min_cash_position) || 0,
        max_cash_position: parseFloat(cashFlow.max_cash_position) || 0,
        total_net_change: parseFloat(cashFlow.total_net_change) || 0
      },
      overall_health: {
        liquidity_ratio: (parseFloat(receivables.total_balance) || 0) / Math.max((parseFloat(payables.total_balance) || 1), 1),
        net_position: (parseFloat(receivables.total_balance) || 0) - (parseFloat(payables.total_balance) || 0)
      }
    };

    return NextResponse.json(
      {
        success: true,
        data: metrics
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/dashboard/metrics:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}