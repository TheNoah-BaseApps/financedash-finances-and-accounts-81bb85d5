/**
 * @swagger
 * /api/dashboard/insights:
 *   get:
 *     summary: Get actionable insights
 *     tags: [Dashboard]
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

    const insights = [];

    // Get upcoming due payables (next 7 days)
    const upcomingPayables = await query(
      `SELECT * FROM accounts_payable
       WHERE user_id = $1 
       AND status = 'pending'
       AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
       ORDER BY due_date ASC`,
      [user.userId]
    );

    if (upcomingPayables.rows && upcomingPayables.rows.length > 0) {
      const totalAmount = upcomingPayables.rows.reduce((sum, p) => sum + parseFloat(p.balance_due), 0);
      insights.push({
        type: 'action',
        priority: 'high',
        category: 'payables',
        title: 'Upcoming Payments Due',
        description: `${upcomingPayables.rows.length} payments totaling $${totalAmount.toFixed(2)} due in the next 7 days`,
        action: 'Review and prioritize payments',
        count: upcomingPayables.rows.length,
        amount: totalAmount
      });
    }

    // Get upcoming due receivables (next 7 days)
    const upcomingReceivables = await query(
      `SELECT * FROM accounts_receivable
       WHERE user_id = $1 
       AND status = 'pending'
       AND date_due BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
       ORDER BY date_due ASC`,
      [user.userId]
    );

    if (upcomingReceivables.rows && upcomingReceivables.rows.length > 0) {
      const totalAmount = upcomingReceivables.rows.reduce((sum, r) => sum + parseFloat(r.balance_due), 0);
      insights.push({
        type: 'opportunity',
        priority: 'medium',
        category: 'receivables',
        title: 'Expected Collections',
        description: `${upcomingReceivables.rows.length} payments totaling $${totalAmount.toFixed(2)} expected in the next 7 days`,
        action: 'Follow up with customers',
        count: upcomingReceivables.rows.length,
        amount: totalAmount
      });
    }

    // Get severely overdue items
    const severelyOverduePayables = await query(
      `SELECT * FROM accounts_payable
       WHERE user_id = $1 AND status = 'overdue'
       AND due_date < CURRENT_DATE - INTERVAL '30 days'
       ORDER BY due_date ASC`,
      [user.userId]
    );

    if (severelyOverduePayables.rows && severelyOverduePayables.rows.length > 0) {
      insights.push({
        type: 'warning',
        priority: 'critical',
        category: 'payables',
        title: 'Severely Overdue Payables',
        description: `${severelyOverduePayables.rows.length} payments are more than 30 days overdue`,
        action: 'Contact suppliers urgently',
        count: severelyOverduePayables.rows.length
      });
    }

    // Check cash position trend
    const recentForecasts = await query(
      `SELECT * FROM cash_flow_forecast
       WHERE user_id = $1
       ORDER BY period_start DESC
       LIMIT 3`,
      [user.userId]
    );

    if (recentForecasts.rows && recentForecasts.rows.length >= 2) {
      const latest = parseFloat(recentForecasts.rows[0].month_ending_cash_position);
      const previous = parseFloat(recentForecasts.rows[1].month_ending_cash_position);
      const trend = latest - previous;

      if (trend < -5000) {
        insights.push({
          type: 'warning',
          priority: 'high',
          category: 'cash_flow',
          title: 'Declining Cash Position',
          description: `Cash position decreased by $${Math.abs(trend).toFixed(2)} in recent period`,
          action: 'Review expenses and collections',
          trend: 'declining'
        });
      } else if (trend > 5000) {
        insights.push({
          type: 'positive',
          priority: 'low',
          category: 'cash_flow',
          title: 'Improving Cash Position',
          description: `Cash position increased by $${trend.toFixed(2)} in recent period`,
          action: 'Consider strategic investments',
          trend: 'improving'
        });
      }
    }

    // Sort insights by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return NextResponse.json(
      {
        success: true,
        data: {
          insights,
          total_insights: insights.length,
          critical_count: insights.filter(i => i.priority === 'critical').length,
          high_count: insights.filter(i => i.priority === 'high').length
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/dashboard/insights:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}