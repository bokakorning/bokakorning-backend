const CourseBooking = require('@models/CourseBooking');
const Courses = require('@models/Courses');
const response = require("../responses")

module.exports = {
createCourseBooking : async (req, res) => {
  try {
    const payload = req.body;
    const newSetting = new CourseBooking(payload);

    await newSetting.save();

    // Add user to enrolled_user in the course (ignore if already enrolled)
    if (payload.courses_id && payload.user) {
      await Courses.findByIdAndUpdate(
        payload.courses_id,
        { $addToSet: { enrolled_user: payload.user } }
      );
    }

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
    const content = await CourseBooking.find({user:req.user.id})
      .populate('courses_id', 'name date time_from time_to city language price course_types questions')
      .sort({ createdAt: -1 });
    return response.ok(res, content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
}
