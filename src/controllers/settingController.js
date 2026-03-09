const Setting = require('@models/Setting');
const response = require("../responses")

module.exports = {
createSetting : async (req, res) => {
  try {
    const payload = req.body;

    const newSetting = new Setting(payload);

    await newSetting.save();
    res.status(201).json({
      message: 'Setting created successfully',
      data: newSetting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

getSetting : async (req, res) => {
  try {
    const content = await Setting.findOne();
    if (!content) {
      return res.status(404).json({ message: 'Setting not found. Please create content first.' });
    }
     return response.ok(res, content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
getSettingForUser : async (req, res) => {
  try {
    const { type, language='en' } = req.query;
    const content = await Setting.findOne({ type, language });
    if (!content) {
      return res.status(404).json({ message: 'Setting not found. Please create content first.' });
    }
     return response.ok(res, content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
updateSetting : async (req, res) => {
  try {
    const payload = req.body;

    const updatedSetting = await Setting.findByIdAndUpdate(
      payload?.id,
      payload,
      { new: true }
    );
    if (!updatedSetting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.status(200).json({ message: 'Setting updated successfully', data: updatedSetting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
}
