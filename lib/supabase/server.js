// This file is kept for compatibility but uses PostgreSQL directly
// Not used in this PostgreSQL-based app, but included for structure
export const createClient = () => {
  throw new Error('This app uses PostgreSQL directly. Use lib/database/aurora instead.');
};