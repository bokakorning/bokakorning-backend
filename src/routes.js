const authRoutes = require('@routes/authRoutes');
const bookingRoutes = require('@routes/bookingRoutes');
const notificationRoutes = require('@routes/notificationRoutes');
const contentRoutes = require('@routes/contentManagementRoutes');
const transactionRoutes = require('@routes/transactionRoutes');
const progressRoutes = require('@routes/moduleRoutes');
const adminRoutes = require('@routes/adminRoutes');
const paymentRoutes = require('@routes/paymentRoutes');
const stripeRoutes = require('@routes/stripeRoutes');
const settingRoutes = require('@routes/settingRoutes');
const prReqRoutes = require('@routes/prReqRoutes');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/booking', bookingRoutes);
  app.use('/notification', notificationRoutes);
  app.use('/transaction', transactionRoutes);
  app.use('/content', contentRoutes);
  app.use('/progress', progressRoutes);
  app.use('/admindashboard', adminRoutes);
  app.use('/payment', paymentRoutes);
  app.use('/stripe', stripeRoutes);
  app.use('/setting', settingRoutes);
  app.use('/peReq', prReqRoutes);
};
