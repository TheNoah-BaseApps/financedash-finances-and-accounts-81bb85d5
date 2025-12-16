import { verifyToken } from './jwt';
import { cookies } from 'next/headers';

/**
 * Get authenticated user from request
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object|null>} User object or null
 */
export async function getAuthUser(request) {
  try {
    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Try to get token from cookies
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value;
    }
    
    if (!token) {
      return null;
    }
    
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

/**
 * Require authentication for API route
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object>} User object or throws error
 */
export async function requireAuth(request) {
  const user = await getAuthUser(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

/**
 * Check if user has required role
 * @param {Object} user - User object
 * @param {string|Array<string>} allowedRoles - Allowed role(s)
 * @returns {boolean} Has required role
 */
export function hasRole(user, allowedRoles) {
  if (!user || !user.role) return false;
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
}

/**
 * Generate unauthorized response
 * @param {string} message - Error message
 * @returns {Response} Unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return Response.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * Generate forbidden response
 * @param {string} message - Error message
 * @returns {Response} Forbidden response
 */
export function forbiddenResponse(message = 'Forbidden') {
  return Response.json(
    { success: false, error: message },
    { status: 403 }
  );
}