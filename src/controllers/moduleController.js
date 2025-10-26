const Module = require('@models/Module');

const response = require('../responses');

module.exports = {
  getmodule: async (req, res) => {
    try {
      const data = await Module.findOne({ student: req.query.id })
      return response.ok(res, data);
    } catch (err) {
      console.log(err);
      return response.error(res, err);
    }
  },
  updatemodule: async (req, res) => {
    try {
        const payload=req.body;
      const data = await Module.findByIdAndUpdate(payload.id, payload)
      return response.ok(res, data);
    } catch (err) {
      console.log(err);
      return response.error(res, err);
    }
  },
};
