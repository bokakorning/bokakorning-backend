const response = require('../responses');
const Booking = require('@models/Booking');
const Payment = require('@models/Payment');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { notify } = require('@services/notification');
const User = require('@models/User');

// ================= HTTPS AGENT =================
const httpsAgent = new https.Agent({
  cert: fs.readFileSync(
    path.join(__dirname, '../../certs/client.pem'),
    { encoding: 'utf8' }
  ),
  key: fs.readFileSync(
    path.join(__dirname, '../../certs/client.key'),
    { encoding: 'utf8' }
  ),
  ca: fs.readFileSync(
    path.join(__dirname, '../../certs/root.pem'),
    { encoding: 'utf8' }
  ),
  passphrase: '123456789', // Only for MSS test certificates
});

// const httpsAgent = new https.Agent({
//   pfx: fs.readFileSync(
//     path.join(__dirname, '../../certs/Swish_Merchant_TestCertificate_1234679304.p12')
//   ),
//   passphrase: 'swish', // default passphrase for Swish test certs
//   ca: fs.readFileSync(
//     path.join(__dirname, '../../certs/Swish_TLS_RootCA.pem'),
//     'utf8'
//   ),
//   keepAlive: true,
// });


// Axios client
const client = axios.create({
  httpsAgent,
  timeout: 15000,
});

// ================= CONTROLLER =================
module.exports = {
  createPaymentRequest: async (req, res) => {
    try {
      const payload = req.body;

      const amount=Number(payload.amount)
      if (!amount) {
        return response.error(res, "Amount is required");
      }
      const instructionUUID = uuidv4().replace(/-/g, '').toUpperCase();

      const data = {
        payeePaymentReference: Date.now().toString(),
        callbackUrl: 'https://api.bokakorning.online/payment/api/swish/callback',
        payeeAlias: '1232989374',
        currency: 'SEK',
        amount: amount,
        message: payload.message || "Payment",
        callbackIdentifier: uuidv4().replace(/-/g, '').toUpperCase(),
      };
      const env = process.env.SWISH_ENV || 'simulator';

      const baseUrl =
        env === 'production'
          ? 'https://cpc.getswish.net/swish-cpcapi/api/v2'
          : 'https://mss.cpc.getswish.net/swish-cpcapi/api/v2';

      const swishRes = await client.put(
        `${baseUrl}/paymentrequests/${instructionUUID}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (swishRes.status === 201) {
        const location = swishRes.headers.location;
        const { paymentrequesttoken } = swishRes.headers;

        const payment = new Payment({
          id: instructionUUID,
          paymentId: location,
          amount: amount,
          status: 'pending',
        });

        await payment.save();

              const now = new Date();
              const date = now
                .toISOString()
                .replace(/[-T:.Z]/g, '')
                .slice(0, 17); // YYYYMMDDHHMMSSmmm
        
              payload.paymentid = instructionUUID;
              payload.token = location; 
              payload.session_id = `BKS-${date}`;
              payload.user = req.body.user;
              let data = new Booking(payload);
              await data.save();
              

        return response.ok(res, {
          id: instructionUUID,
          location,
          token: paymentrequesttoken
        });
      }

      return response.error(res, "Unexpected Swish response");
    } catch (err) {
      console.error("Swish API Error:", err.response?.data || err.message);

      return response.error(
        res,
        err.response?.data || "Swish Connection Error"
      );
    }
  },

  updatepaymentdata: async (req, res) => {
    const payment = req.body;
    const identifier = req.headers['callbackidentifier'];
console.log('Received payment callback with identifier:', identifier);
console.log('Received payment callback:', payment);
    // if (identifier !== process.env.SWISH_CALLBACK_IDENTIFIER) {
    //   return res.status(403).send('Invalid callback identifier');
    // }
    if (payment.status === 'PAID') {
      console.log('Payment successful:');
      await Payment.updateOne(
      { id: payment.id },
      { status: "PAID" }
      );
      const data = await Booking.findOneAndUpdate({ paymentid: payment.id }, { payment_status: "PAID" });
      await User.updateOne(
          { _id: data?.user, firstbook: false },
          { $set: { firstbook: true } }
        );
      await notify(
                data?.user,
                'Session Created',
                'Your session created successfully',
              );
              if (data?.instructer) {
                await notify(
                  data?.instructer,
                  'New Request',
                  'You have a new lesson request.',
                );
              }
    } else {
      console.log(`Payment ${payment.status}:`, payment);
      await Payment.updateOne(
      { id: payment.id },
      { status: payment.status }
      );
    }

    return res.status(200).send('OK');
  },

  paymentStatus: async (req, res) => {
      const { paymentId } = req.params;
  try {    
    const payment = await Payment.findOne({ id:paymentId });
    if (!payment) {
      return response.notFound(res, 'Payment not found');
    }
    return response.ok(res, { status: payment.status });
  } catch (err) {
    console.log(err);
    return response.error(res, err);      
  }
  },
};