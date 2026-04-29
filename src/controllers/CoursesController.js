const Courses = require('@models/Courses');
const response = require("../responses")

module.exports = {
createCourses : async (req, res) => {
  try {
    const payload = req.body;

    const newSetting = new Courses(payload);

    await newSetting.save();
    res.status(201).json({
      message: 'Courses created successfully',
      data: newSetting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

getCourses : async (req, res) => {
  try {
    const { course_types, city } = req.query;
    const filter = {};
    if (course_types) filter.course_types = course_types;
    if (city) filter.city = city;
    const content = await Courses.find(filter).sort({ createdAt: -1 });
    return response.ok(res, content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
getCoursesForUser : async (req, res) => {
  try {
    const { type, language='en' } = req.query;
    const content = await Courses.findOne({ type, language });
    if (!content) {
      return res.status(404).json({ message: 'Course not found. Please create content first.' });
    }
     return response.ok(res, content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
updateCourses : async (req, res) => {
  try {
    const payload = req.body;

    const updatedSetting = await Courses.findByIdAndUpdate(
      payload?.id,
      payload,
      { new: true }
    );
    if (!updatedSetting) {
      return res.status(404).json({ message: 'Courses not found' });
    }
    return response.ok(res, updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

deleteCourses : async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }
    const deleted = await Courses.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return response.ok(res, deleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
}
