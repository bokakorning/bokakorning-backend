const Booking = require('@models/Booking');
module.exports = {
  createRide: async (req, res) => {
    try {
      const payload = req?.body || {};
      
      let data = new Ride(payload);
      
      await data.save();

     
      return response.ok(res, data, { message: "Ride Book successfully" });
    } catch (error) {
      return response.error(res, error);
    }
  },
}