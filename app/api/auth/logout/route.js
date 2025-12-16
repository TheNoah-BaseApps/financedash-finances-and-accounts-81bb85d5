/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // In a JWT-based system, logout is handled client-side by removing the token
    // This endpoint exists for consistency and future enhancements (e.g., token blacklisting)
    
    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/auth/logout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    );
  }
}