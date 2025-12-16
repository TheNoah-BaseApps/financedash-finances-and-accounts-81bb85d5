import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const ALGORITHM = 'HS256';

/**
 * Generate JWT token for user
 * @param {Object} payload - User data to encode
 * @returns {Promise<string>} JWT token
 */
export async function signToken(payload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET_KEY);
    
    return token;
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw new Error('Failed to generate token');
  }
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object>} Decoded payload
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract user ID from token
 * @param {string} token - JWT token
 * @returns {Promise<string|null>} User ID or null
 */
export async function getUserIdFromToken(token) {
  try {
    const payload = await verifyToken(token);
    return payload?.userId || null;
  } catch (error) {
    return null;
  }
}