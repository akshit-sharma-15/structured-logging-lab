const SERVICE_NAME = 'orders-api';

const write = (level, msg, fields = {}) => {
  // Keep every entry on one line so Docker and JSON tooling can process it safely.
  process.stdout.write(`${JSON.stringify({
    ts: new Date().toISOString(),
    level,
    service: SERVICE_NAME,
    msg,
    ...fields,
  })}\n`);
};

const createLogger = (baseFields = {}) => ({
  info: (msg, fields) => write('info', msg, { ...baseFields, ...fields }),
  warn: (msg, fields) => write('warn', msg, { ...baseFields, ...fields }),
  error: (msg, fields) => write('error', msg, { ...baseFields, ...fields }),
  child: (fields) => createLogger({ ...baseFields, ...fields }),
});

module.exports = { logger: createLogger() };
