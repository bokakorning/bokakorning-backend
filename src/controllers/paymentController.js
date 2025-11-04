import axios from 'axios';
import fs from 'fs';
import https from 'https';
import { v4 as uuidv4 } from 'uuid';
const response = require('../responses');

const httpsAgent = new https.Agent({
  cert: fs.readFileSync('./certs/client.pem'),
  key: fs.readFileSync('./certs/client.key'),
  ca: fs.readFileSync('./certs/root.pem'),
});

const client = axios.create({ httpsAgent });

module.exports = {
  createPaymentRequest: async (req, res) => {
    const { amount, message } = req.body;
    const instructionUUID = uuidv4();

    const data = {
      payeeAlias: '1234679304',
      currency: 'SEK',
      amount,
      message,
      callbackUrl: 'https://your-domain.com/api/swish/callback',
      callbackIdentifier: 'MY_MERCHANT_APP',
    };

    try {
      const swishRes = await client.put(
        `https://mss.cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests/${instructionUUID}`,
        data
      );

      if (swishRes.status === 201) {
        const paymentRequestToken = swishRes.headers.paymentrequesttoken;
        return response.ok(res, { id: instructionUUID, token: paymentRequestToken });
      }

      return response.error(res, 'Failed to create payment request');
    } catch (error) {
      console.error('Error creating payment:', error.response?.data || error);
      return response.error(res, error);
    }
  },

  updatepaymentdata: async (req, res) => {
    const payment = req.body;
    const identifier = req.headers['callbackidentifier'];

    if (identifier !== 'MY_MERCHANT_APP') {
      return res.status(403).send('Invalid callback identifier');
    }

    if (payment.status === 'PAID') {
      console.log('✅ Payment successful:', payment);
      // TODO: mark order paid in DB
    } else {
      console.log(`❌ Payment ${payment.status}:`, payment);
    }

    return res.status(200).send('OK');
  },
};
