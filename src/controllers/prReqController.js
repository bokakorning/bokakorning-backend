const PrReq = require('@models/PrReq');
const response = require("../responses")

module.exports = {

getPrReq : async (req, res) => {
  try {
    const content = await PrReq.findOne();
    if (!content) {
      return res.status(404).json({ message: 'PrReq not found. Please create content first.' });
    }
     return response.ok(res, content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
updatePrReq : async (req, res) => {
  try {
    const payload = req.body;

    const updatedPrReq = await PrReq.findByIdAndUpdate(
      payload?.id,
      payload,
      { new: true }
    );
    if (!updatedPrReq) {
      const newPrReq = new PrReq(payload);
      await newPrReq.save();
      return res.status(404).json({ message: 'PrReq not found' });
    }
    res.status(200).json({ message: 'PrReq updated successfully', data: updatedPrReq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
}
