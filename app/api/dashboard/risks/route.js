/**
 * @swagger
 * /api/dashboard/risks:
 *   get:
 *     summary: Get all risk indicators
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Success
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { requireAuth } from '@/lib/auth';
import { calculateDaysOverdue, hasCashShortfall } from '@/lib/calculations';

export async function GET(request) {
  try {
    const user = await requireAuth(request);

    // Get overdue payables
    const overduePayables = await query(
      `SELECT * FROM accounts_payable
       WHERE user_id = $1 AND status = 'overdue' AND balance_due > 0
       ORDER BY due_date ASC, balance_due DESC`,
      [user.userId]
    );

    // Get overdue receivables
    const overdueReceivables = await query(
      `SELECT * FROM accounts_receivable
       WHERE user_id = $1 AND status = 'overdue' AND balance_due > 0
       ORDER BY date_due ASC, balance_due DESC`,
      [user.userId]
    );

    // Get cash flow forecasts with potential shortfalls
    const cashFlowRisks = await query(
      `SELECT * FROM cash_flow_forecast
       WHERE user_id = $1 AND month_ending_cash_position < 10000
       ORDER BY period_start ASC`,
      [user.userId]
    );

    // Process and categorize risks
    const risks = {
      critical: [],
      warning: [],
      info: []
    };

    // Process overdue payables
    (overduePayables.rows || []).forEach(payable => {
      const daysOverdue = calculateDaysOverdue(payable.due_date);
      const risk = {
        type: 'payable',
        severity: daysOverdue > 30 ? 'critical' : 'warning',
        title: `Overdue Payment to ${payable.supplier_name}`,
        description: `Invoice ${payable.invoice_number} is ${daysOverdue} days overdue`,
        amount: payable.balance_due,
        daysOverdue,
        id: payable.id,
        dueDate: payable.due_date
      };

      if (risk.severity === 'critical') {
        risks.critical.push(risk);
      } else {
        risks.warning.push(risk);
      }
    });

    // Process overdue receivables
    (overdueReceivables.rows || []).forEach(receivable => {
      const daysOverdue = calculateDaysOverdue(receivable.date_due);
      const risk = {
        type: 'receivable',
        severity: daysOverdue > 30 ? 'critical' : 'warning',
        title: `Delayed Collection from ${receivable.customer}`,
        description: `Invoice ${receivable.invoice_number} is ${daysOverdue} days overdue`,
        amount: receivable.balance_due,
        daysOverdue,
        id: receivable.id,
        dueDate: receivable.date_due
      };

      if (risk.severity === 'critical') {
        risks.critical.push(risk);
      } else {
        risks.warning.push(risk);
      }
    });

    // Process cash flow risks
    (cashFlowRisks.rows || []).forEach(forecast => {
      const shortfall = hasCashShortfall(forecast.month_ending_cash_position);
      if (shortfall) {
        const risk = {
          type: 'cash_flow',
          severity: forecast.month_ending_cash_position < 5000 ? 'critical' : 'warning',
          title: 'Cash Shortfall Projected',
          description: `Period ${forecast.period_start} to ${forecast.period_end}`,
          amount: forecast.month_ending_cash_position,
          id: forecast.id,
          period: `${forecast.period_start} - ${forecast.period_end}`
        };

        if (risk.severity === 'critical') {
          risks.critical.push(risk);
        } else {
          risks.warning.push(risk);
        }
      }
    });

    // Calculate totals
    const totals = {
      total_risks: risks.critical.length + risks.warning.length + risks.info.length,
      critical_count: risks.critical.length,
      warning_count: risks.warning.length,
      info_count: risks.info.length,
      total_overdue_payables: overduePayables.rows?.length || 0,
      total_overdue_receivables: overdueReceivables.rows?.length || 0,
      total_cash_flow_risks: cashFlowRisks.rows?.length || 0
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          risks,
          totals
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/dashboard/risks:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch risks' },
      { status: 500 }
    );
  }
}