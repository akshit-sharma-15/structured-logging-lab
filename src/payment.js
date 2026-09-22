const processPayment = (requestLogger) => {
  requestLogger.info('payment.processing');
  // Simulate some payment processing
  setTimeout(() => {
    requestLogger.info('payment.completed');
  }, 500);
};

module.exports = { processPayment };
