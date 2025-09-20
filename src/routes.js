const authRoutes = require("@routes/authRoutes");
const bookingRoutes = require("@routes/bookingRoutes");

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/booking', bookingRoutes);
};
