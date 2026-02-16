const response = require('../responses');
const Booking = require('@models/Booking');
const Payment = require('@models/Payment');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { log } = require('console');
const { console } = require('inspector');

const httpsAgent = new https.Agent({
  cert: fs.readFileSync(path.join(__dirname, '../../certs/client.pem')),
  key: fs.readFileSync(path.join(__dirname, '../../certs/client.key')),
  ca: fs.readFileSync(path.join(__dirname, '../../certs/root.pem')),
});
const client = axios.create({ httpsAgent });
module.exports = {
  createPaymentRequest: async (req, res) => {
    const { amount, message } = req.body;
    console.log('Creating payment request with amount:', req.body);
    const instructionUUID = uuidv4();

    const data = {
      payeeAlias: '1234679304',
      currency: 'SEK',
      amount,
      message,
      callbackUrl: 'https://api.bokakorning.online/payment/api/swish/callback',
      callbackIdentifier: 'MY_MERCHANT_APP',
    };
    try {
      const SWISH_BASE_URL =
        process.env.SWISH_ENV === 'production'
          ? 'https://cpc.getswish.net'
          : 'https://staging.getswish.pub.tds.tieto.com';
      
      const swishRes = await client.post(
        `${SWISH_BASE_URL}/cpc-swish/api/v1/paymentrequests`,
        data
      );
      
            if (swishRes.status === 201) {
              const paymentRequestToken = swishRes.headers.paymentrequesttoken;
              const payment = new Payment({
                id: instructionUUID,
                // userId: req.user._id,
                paymentId: paymentRequestToken,
                amount,
                status: 'pending',
              });
              await payment.save();
              return response.ok(res, { id: instructionUUID, token: paymentRequestToken });
            }
      
            return response.error(res, 'Failed to create payment request');
    } catch (err) {
      console.log(err);
      return response.error(res, err);
    }
  },

  updatepaymentdata: async (req, res) => {
    const payment = req.body;
    const identifier = req.headers['callbackidentifier'];

    if (identifier !== 'MY_MERCHANT_APP') {
      return res.status(403).send('Invalid callback identifier');
    }
console.log('Received payment callback:', payment);
    if (payment.status === 'PAID') {
      console.log('Payment successful:');
      // TODO: mark order paid in DB
    } else {
      console.log(`Payment ${payment.status}:`, payment);
    }

    return res.status(200).send('OK');
  },

  paymentStatus: async (req, res) => {
      const { paymentId } = req.params;
  try {    
    const payment = await Payment.findOne({ paymentId });
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