const Booking = require('@models/Booking');
const response = require('@responses/index');
module.exports = {
  createBooking: async (req, res) => {
    try {
      const payload = req?.body || {};
      payload.user = req.user.id;
      let data = new Booking(payload);
      await data.save();
      return response.ok(res, {
        data,
        message: 'Instructer Book successfully',
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  getinstructerreqs: async (req, res) => {
    try {
      let data = await Booking.find({
        instructer: req.user.id,
        status: { $in: ['pending', 'cancel'] },
        rejectedbydriver: { $nin: [req.user.id] },
      }).populate('user');
      return response.ok(res, data);
    } catch (error) {
      return response.error(res, error);
    }
  },
  getuserbookings: async (req, res) => {
    try {
      let cond={
        user: req.user.id,
        status: 'pending'
      }
      if (req?.query?.status==="cancel"||req?.query?.status==="complete") {
        cond.status=req?.query?.status
      }
      let data = await Booking.find(cond).populate('instructer',"-password");
      return response.ok(res, data);
    } catch (error) {
      return response.error(res, error);
    }
  },
  updatebookingstatus: async (req, res) => {
    try {
      const payload = req?.body || {};
      if (!payload.id || !payload.status) {
        return response.error(res, {
          message: 'Booking id and status are required',
        });
      }
      const update = { $set: { status: payload.status } };
      if (payload.status === 'cancel') {
        // add instructor to rejectedbyinstructer array (no duplicates)
        update.$addToSet = { rejectedbyinstructer: req.user.id };
      }
      await Booking.findByIdAndUpdate(payload?.id, update);
      return response.ok(res, {
        message: `Booking ${payload.status === 'cancel' ? 'Canceled' : 'Accepted'}`,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
