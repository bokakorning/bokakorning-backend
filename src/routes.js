const authRoutes = require('@routes/authRoutes');
const bookingRoutes = require('@routes/bookingRoutes');
const notificationRoutes = require('@routes/notificationRoutes');
const contentRoutes = require('@routes/contentManagementRoutes');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/booking', bookingRoutes);
  app.use('/notification', notificationRoutes);
  app.use('/content', contentRoutes);
};
