const Courses = require('@models/Courses');
const response = require("../responses");
const { s3, DeleteObjectCommand } = require('@services/fileUpload');

const IMAGE_LIMIT = 100 * 1024; // 100 KB

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
    const { id, ...fields } = req.body;
    const updatedSetting = await Courses.findByIdAndUpdate(
      id,
      { $set: fields },
      { new: true, runValidators: false }
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

uploadCourseMedia : async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const isImage = req.file.mimetype.startsWith('image/');
    if (isImage && req.file.size > IMAGE_LIMIT) {
      // Delete the already-uploaded S3 object and reject
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.key,
      }));
      return res.status(400).json({ message: `Image must be under 100 KB (uploaded: ${Math.round(req.file.size / 1024)} KB)` });
    }
    return response.ok(res, {
      media_url: req.file.location,
      media_type: isImage ? 'image' : 'video',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

getEnrolledUsers : async (req, res) => {
  try {
    const { course_id } = req.query;
    if (!course_id) return res.status(400).json({ message: 'course_id is required' });
    const course = await Courses.findById(course_id)
      .populate('enrolled_user', 'name email phone image');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    return response.ok(res, course.enrolled_user);
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
