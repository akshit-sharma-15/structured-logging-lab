const express = require('express');
const { connectDb } = require('./db');
const ordersRouter = require('./routes/orders');
const { processPayment } = require('./payment');
const { randomUUID } = require('crypto');
const { logger } = require('./logger');

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  const reqId = randomUUID();
  req.log = logger.child({ reqId });
  res.setHeader('X-Request-Id', reqId);
  req.log.info('request.started', { method: req.method, path: req.path });
  res.on('finish', () => {
    req.log.info('request.completed', { method: req.method, path: req.path, statusCode: res.statusCode });
  });
  next();
});

logger.info('service.starting');

connectDb();

app.get('/', (req, res) => {
  req.log.info('health.checked');
  res.send('Orders API is running');
});

app.use('/orders', ordersRouter);

app.post('/payments', (req, res) => {
  req.log.info('payment.started');
  processPayment(req.log);
  res.send('Payment processed');
});

app.get('/simulate-error', (req, res) => {
  req.log.error('simulation.failed', { error: 'Intentional failure for logging verification' });
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  logger.info('service.listening', { port });
});
