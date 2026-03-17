const mongoose = require("mongoose");
const response = require('../responses');
const Stripe = require("stripe")
const Booking = require('@models/Booking');
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_SECRET_KEY);


module.exports = {
  poststripe: async (req, res) => {
    try {
      const priceFormatStripe = Math.round(req.body.price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: priceFormatStripe,
        currency: req.body.currency,
        // automatic_payment_methods: {
        //   enabled: true,
        // },
        payment_method_types: ["card", "klarna"]
      });

      return response.ok(res, {
        clientSecret: paymentIntent.client_secret,
        price: req.body.price,
        error: null,
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  createBooking: async (req, res) => {
      try {
        const payload = req.body;
  
                const now = new Date();
                const date = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 17); // YYYYMMDDHHMMSSmmm
          
                payload.session_id = `BKS-${date}`;
                payload.user = req.user.id;
                let data = new Booking(payload);
                await data.save();
                
          return response.ok(res, {message:'Booking create sucesfully'});
        
      } catch (err) {
        console.error("Swish API Error:", err.response?.data || err.message);
  
        return response.error(
          res,
          err.response?.data || "Swish Connection Error"
        );
      }
    },
  }
