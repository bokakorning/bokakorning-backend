const authRoutes = require('@routes/authRoutes');
const bookingRoutes = require('@routes/bookingRoutes');
const notificationRoutes = require('@routes/notificationRoutes');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/booking', bookingRoutes);
  app.use('/notification', notificationRoutes);
};
