import { query, getClient } from './database/aurora';

/**
 * Log audit trail for data changes
 * @param {Object} params - Audit log parameters
 * @param {string} params.userId - User ID performing action
 * @param {string} params.tableName - Table being modified
 * @param {string} params.recordId - Record ID being modified
 * @param {string} params.action - Action type (create, update, delete)
 * @param {Object} params.oldValues - Old values (for update/delete)
 * @param {Object} params.newValues - New values (for create/update)
 * @returns {Promise<void>}
 */
export async function logAudit({ userId, tableName, recordId, action, oldValues = null, newValues = null }) {
  try {
    await query(
      `INSERT INTO audit_logs (user_id, table_name, record_id, action, old_values, new_values, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        userId,
        tableName,
        recordId,
        action,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null
      ]
    );
  } catch (error) {
    console.error('Error logging audit:', error);
    // Don't throw - audit logging should not break the main operation
  }
}

/**
 * Log create action
 * @param {string} userId - User ID
 * @param {string} tableName - Table name
 * @param {string} recordId - Record ID
 * @param {Object} newValues - New record values
 * @returns {Promise<void>}
 */
export async function logCreate(userId, tableName, recordId, newValues) {
  return logAudit({
    userId,
    tableName,
    recordId,
    action: 'create',
    newValues
  });
}

/**
 * Log update action
 * @param {string} userId - User ID
 * @param {string} tableName - Table name
 * @param {string} recordId - Record ID
 * @param {Object} oldValues - Old record values
 * @param {Object} newValues - New record values
 * @returns {Promise<void>}
 */
export async function logUpdate(userId, tableName, recordId, oldValues, newValues) {
  return logAudit({
    userId,
    tableName,
    recordId,
    action: 'update',
    oldValues,
    newValues
  });
}

/**
 * Log delete action
 * @param {string} userId - User ID
 * @param {string} tableName - Table name
 * @param {string} recordId - Record ID
 * @param {Object} oldValues - Old record values
 * @returns {Promise<void>}
 */
export async function logDelete(userId, tableName, recordId, oldValues) {
  return logAudit({
    userId,
    tableName,
    recordId,
    action: 'delete',
    oldValues
  });
}

/**
 * Get audit logs with filtering
 * @param {Object} filters - Filter parameters
 * @param {string} filters.userId - Filter by user ID
 * @param {string} filters.tableName - Filter by table name
 * @param {string} filters.action - Filter by action type
 * @param {string} filters.startDate - Filter by start date
 * @param {string} filters.endDate - Filter by end date
 * @param {number} filters.limit - Result limit
 * @param {number} filters.offset - Result offset
 * @returns {Promise<Array>} Audit logs
 */
export async function getAuditLogs(filters = {}) {
  try {
    let queryText = `
      SELECT al.*, u.name as user_name, u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (filters.userId) {
      queryText += ` AND al.user_id = $${paramCount}`;
      params.push(filters.userId);
      paramCount++;
    }
    
    if (filters.tableName) {
      queryText += ` AND al.table_name = $${paramCount}`;
      params.push(filters.tableName);
      paramCount++;
    }
    
    if (filters.action) {
      queryText += ` AND al.action = $${paramCount}`;
      params.push(filters.action);
      paramCount++;
    }
    
    if (filters.startDate) {
      queryText += ` AND al.timestamp >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }
    
    if (filters.endDate) {
      queryText += ` AND al.timestamp <= $${paramCount}`;
      params.push(filters.endDate);
      paramCount++;
    }
    
    queryText += ` ORDER BY al.timestamp DESC`;
    
    if (filters.limit) {
      queryText += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      paramCount++;
    }
    
    if (filters.offset) {
      queryText += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
    }
    
    const result = await query(queryText, params);
    return result.rows || [];
  } catch (error) {
    console.error('Error getting audit logs:', error);
    throw error;
  }
}