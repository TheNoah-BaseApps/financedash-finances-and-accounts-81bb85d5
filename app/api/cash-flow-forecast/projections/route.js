/**
 * @swagger
 * /api/cash-flow-forecast/projections:
 *   get:
 *     summary: Get cash flow projections
 *     tags: [Cash Flow]
 *     responses:
 *       200:
 *         description: Success
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { requireAuth } from '@/lib/auth';
import { hasCashShortfall } from '@/lib/calculations';

export async function GET(request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '6');

    const result = await query(
      `SELECT * FROM cash_flow_forecast
       WHERE user_id = $1
       ORDER BY period_start ASC
       LIMIT $2`,
      [user.userId, months]
    );

    const forecasts = result.rows || [];

    // Calculate projections
    const projections = forecasts.map((forecast, index) => {
      const shortfall = hasCashShortfall(forecast.month_ending_cash_position);
      
      return {
        ...forecast,
        has_shortfall: shortfall,
        period_label: `Month ${index + 1}`,
        trend: index > 0 
          ? forecast.month_ending_cash_position > forecasts[index - 1].month_ending_cash_position 
            ? 'up' 
            : 'down'
          : 'neutral'
      };
    });

    // Calculate summary statistics
    const summary = {
      total_periods: projections.length,
      periods_with_shortfall: projections.filter(p => p.has_shortfall).length,
      average_ending_balance: projections.length > 0
        ? projections.reduce((sum, p) => sum + parseFloat(p.month_ending_cash_position), 0) / projections.length
        : 0,
      lowest_balance: projections.length > 0
        ? Math.min(...projections.map(p => parseFloat(p.month_ending_cash_position)))
        : 0,
      highest_balance: projections.length > 0
        ? Math.max(...projections.map(p => parseFloat(p.month_ending_cash_position)))
        : 0
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          projections,
          summary
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/cash-flow-forecast/projections:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch projections' },
      { status: 500 }
    );
  }
}