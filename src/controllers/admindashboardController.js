const Booking = require('@models/Booking');
const User = require('@models/User');
const response = require('@responses/index');
const Transaction = require('@models/Transaction');
module.exports = {
  totalnumberdata: async (req, res) => {
    try {
      const [user, instructer, activebooking, cancelbooking, completebooking] =
        await Promise.all([
          User.countDocuments({ type: 'user' }),
          User.countDocuments({ type: 'instructer' }),
          Booking.countDocuments({ status: 'started' }),
          Booking.countDocuments({ status: 'cancel' }),
          Booking.countDocuments({ status: 'complete' }),
        ]);
      return response.ok(res, {
        user,
        instructer,
        activebooking,
        cancelbooking,
        completebooking,
      });
    } catch (err) {
      console.log(err);
      response.error(res, err);
    }
  },
  lastweekbookings: async (req, res) => {
    try {
      const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // includes today

  const last7DaysBookings = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)) }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        total: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } } // sort by date ascending
  ]);
      return response.ok(res, last7DaysBookings);
    } catch (err) {
      console.log(err);
      response.error(res, err);
    }
  },
  lastweekusers: async (req, res) => {
    try {
      const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // includes today


  const last7DaysUsers = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)) },
        type:req.query.type
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        total: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } } // sort by date ascending
  ]);
      return response.ok(res, last7DaysUsers);
    } catch (err) {
      console.log(err);
      response.error(res, err);
    }
  },
};
