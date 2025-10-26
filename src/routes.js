const authRoutes = require('@routes/authRoutes');
const bookingRoutes = require('@routes/bookingRoutes');
const notificationRoutes = require('@routes/notificationRoutes');
const contentRoutes = require('@routes/contentManagementRoutes');
const transactionRoutes = require('@routes/transactionRoutes');
const progressRoutes = require('@routes/moduleRoutes');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/booking', bookingRoutes);
  app.use('/notification', notificationRoutes);
  app.use('/transaction', transactionRoutes);
  app.use('/content', contentRoutes);
  app.use('/progress', progressRoutes);
};
