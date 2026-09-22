const { Pool } = require('pg');
const { logger } = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'ordersdb',
  port: process.env.DB_PORT || 5432,
});

const connectDb = async () => {
  logger.info('db.connecting');
  try {
    await pool.query('SELECT NOW()');
    logger.info('db.connected');
  } catch (err) {
    logger.warn('db.connection_failed', { error: 'Database connection failed' });
    logger.info('db.retry_scheduled');
  }
};

const queryDb = async (text, params, requestLogger = logger) => {
  requestLogger.info('db.query_started');
  const res = await pool.query(text, params);
  requestLogger.info('db.query_finished', { rowCount: res.rowCount });
  return res;
};

module.exports = { connectDb, queryDb, pool };
