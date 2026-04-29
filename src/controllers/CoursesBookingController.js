const CourseBooking = require('@models/CourseBooking');
const response = require("../responses")

module.exports = {
createCourseBooking : async (req, res) => {
  try {
    const payload = req.body;
    const newSetting = new CourseBooking(payload);

    await newSetting.save();
    return response.ok(res, {
      message: 'Course Booked Successfully',
      data: newSetting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

getCourseBooking : async (req, res) => {
  try {
    const content = await CourseBooking.find({user:req.user.id}).sort({ createdAt: -1 });
    return response.ok(res, content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
}
