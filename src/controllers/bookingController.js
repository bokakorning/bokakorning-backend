const Booking = require('@models/Booking');
const User = require('@models/User');
const response = require('@responses/index');
const Transaction = require('@models/Transaction');
const { notify } = require('@services/notification');
module.exports = {
  createBooking: async (req, res) => {
    try {
      const payload = req?.body || {};
      const now = new Date();
      const date = now
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 17); // YYYYMMDDHHMMSSmmm

      payload.session_id = `BKS-${date}`;
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
      }).sort({ createdAt: -1 }).populate('user');
      return response.ok(res, data);
    } catch (error) {
      return response.error(res, error);
    }
  },
  getcompletesession: async (req, res) => {
    try {
      let data = await Booking.find({
        instructer: req.user.id,
        status: 'complete',
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
  getschedulebookings: async (req, res) => {
    try {
      let data = await Booking.find({sheduleSeesion:true,instructer:{ $exists: false }})
        .sort({ createdAt: -1 })
        .populate('user', '-password');
      return response.ok(res, data);
    } catch (error) {
      return response.error(res, error);
    }
  },
  getAllBookings: async (req, res) => {
    try {
      const { page = 1, limit = 20, } = req.query;
      let bookings = await Booking.find().sort({
          createdAt: -1,
        })
        .populate('user instructer', '-password')
        .limit(limit * 1)
        .skip((page - 1) * limit);;
      return response.ok(res, bookings);
    } catch (err) {
      console.log(err);
      response.error(res, err);
    }
  },
  getinstructersforschedulesession: async (req, res) => {
      try {
        let data = await Booking.findById(req?.params?.id)
        const users = await User.find({
            type: "instructer",
            transmission: { $in: [data.transmission, "Both"] },
            location: {
              $near: {
                $maxDistance: 1609.34 * 10,
                $geometry: data.user_location,
              },
            },
          }).select('-password');
        return response.ok(res, users);
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
  assignInstructer: async (req, res) => {
    try {
      const payload = req?.body || {};
      if (!payload.booking_id || !payload.instructer_id) {
        return response.error(res, {
          message: 'Booking id and Instructer id are required',
        });
      }
      const users = await User.findById(payload.instructer_id)
       await Booking.findByIdAndUpdate(payload.booking_id, { $set: { instructer: payload.instructer_id,total:users.rate_per_hour } });
      await notify(
          payload.instructer_id,
          'New Request',
          'You have a new session request',
        );
      return response.ok(res, {
        message: `Instructer Assigned`,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  finishbooking: async (req, res) => {
    try {
      const payload = req?.body || {};
      if (!payload.id || !payload.status) {
        return response.error(res, {
          message: 'Booking id and status are required',
        });
      }
      const data= await Booking.findByIdAndUpdate(payload?.id, { $set: { status: payload.status } });
      await notify(
          data?.user,
          'Session Completed',
          'Your session compleded successfully',
        );
         await User.findByIdAndUpdate(req.user.id, { $inc: { wallet: Number(data?.total) } });
        const obj ={
          req_user: data?.instructer,
              amount: Number(data?.total),
              type:'EARN',
              status:'Approved',
        }
        const txn = new Transaction(obj);
               await txn.save();
      return response.ok(res, {message: `Session finished`});
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
