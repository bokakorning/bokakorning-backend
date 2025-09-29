const Booking = require('@models/Booking');
const response = require('@responses/index');
const { notify } = require('@services/notification');
module.exports = {
  createBooking: async (req, res) => {
    try {
      const payload = req?.body || {};
      payload.user = req.user.id;
      let data = new Booking(payload);
      await data.save();
      await notify(
        payload?.user,
        'Session Created',
        'Your session created successfully',
      );
      if (payload?.instructer) {
        await notify(
          payload?.instructer,
          'New Request',
          'You have a new lesson request.',
        );
      }
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
        rejectedbyinstructer: { $nin: [req.user.id] },
      })
        .sort({ createdAt: -1 })
        .populate('user');
      return response.ok(res, data);
    } catch (error) {
      return response.error(res, error);
    }
  },
  getaccinstructerreqs: async (req, res) => {
    try {
      let data = await Booking.find({
        instructer: req.user.id,
        status: 'accepted',
      }).populate('user');
      return response.ok(res, data);
    } catch (error) {
      return response.error(res, error);
    }
  },
  getuserbookings: async (req, res) => {
    try {
      let cond = {
        user: req.user.id,
        status: 'pending',
      };
      if (
        req?.query?.status === 'cancel' ||
        req?.query?.status === 'complete'
      ) {
        cond.status = req?.query?.status;
      }
      let data = await Booking.find(cond)
        .sort({ createdAt: -1 })
        .populate('instructer', '-password');
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
      const data = await Booking.findByIdAndUpdate(payload?.id, update);
      if (payload.status === 'cancel') {
        await notify(
          data?.user,
          'Session Canceled',
          'Your session was canceled by the instructor. Please select another instructor.',
        );
      } else {
        await notify(
          data?.user,
          'Session Confirm',
          'Your session has been accepted by the instructor.',
        );
      }
      return response.ok(res, {
        message: `Booking ${payload.status === 'cancel' ? 'Canceled' : 'Accepted'}`,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  reBooking: async (req, res) => {
    try {
      const payload = req?.body || {};
      let data = await Booking.findByIdAndUpdate(payload?.booking_id, {
        $set: {
          status: 'pending',
          instructer: payload?.instructer,
          selectedTime: payload?.selectedTime,
        },
      });
      await notify(
        payload?.user,
        'Session Created',
        'Your session created successfully',
      );
      if (payload?.instructer) {
        await notify(
          payload?.instructer,
          'New Request',
          'You have a new lesson request.',
        );
      }
      return response.ok(res, {
        data,
        message: 'Instructer Book successfully',
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
