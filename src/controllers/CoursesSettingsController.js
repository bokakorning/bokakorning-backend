const CoursesSettings = require('@models/CoursesSettings');
const response = require("../responses")

module.exports = {
createCoursesSettings : async (req, res) => {
  try {
    const payload = req.body;

    const newSetting = new CoursesSettings(payload);

    await newSetting.save();
    res.status(201).json({
      message: 'Courses Settings created successfully',
      data: newSetting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

getCoursesSettings : async (req, res) => {
  try {
    const content = await CoursesSettings.findOne();
    if (!content) {
      return res.status(404).json({ message: 'Courses Settings not found. Please create content first.' });
    }
     return response.ok(res, content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
getCoursesSettingsForUser : async (req, res) => {
  try {
    const { type, language='en' } = req.query;
    const content = await CoursesSettings.findOne({ type, language });
    if (!content) {
      return res.status(404).json({ message: 'Course sSettings not found. Please create content first.' });
    }
     return response.ok(res, content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
updateCoursesSettings : async (req, res) => {
  try {
    const payload = req.body;

    const updatedSetting = await CoursesSettings.findByIdAndUpdate(
      payload?.id,
      payload,
      { new: true }
    );
    if (!updatedSetting) {
      return res.status(404).json({ message: 'CoursesSettings not found' });
    }
    res.status(200).json({ message: 'Courses Settings updated successfully', data: updatedSetting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
addCityInCourseSetting : async (req, res) => {
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ message: 'cityName is required' });
    }

    let corsset = await CoursesSettings.findOne();
    if (!corsset) {
      const newSetting = new CoursesSettings({ city: [{ name: cityName }] });
      await newSetting.save();
      return response.ok(res, newSetting);
    }

    const updatedSetting = await CoursesSettings.findByIdAndUpdate(
      corsset._id,
      { $push: { city: { name: cityName } } },
      { new: true }
    );
    return response.ok(res, updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

updateCityInCourseSetting : async (req, res) => {
  try {
    const { cityId, cityName } = req.body;
    if (!cityId || !cityName) {
      return res.status(400).json({ message: 'cityId and cityName are required' });
    }

    const updatedSetting = await CoursesSettings.findOneAndUpdate(
      { 'city._id': cityId },
      { $set: { 'city.$.name': cityName } },
      { new: true }
    );
    if (!updatedSetting) {
      return res.status(404).json({ message: 'City not found' });
    }
    return response.ok(res, updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

deleteCityInCourseSetting : async (req, res) => {
  try {
    const { cityId } = req.body;
    if (!cityId) {
      return res.status(400).json({ message: 'cityId is required' });
    }

    const corsset = await CoursesSettings.findOne();
    if (!corsset) {
      return res.status(404).json({ message: 'CoursesSettings not found' });
    }

    const updatedSetting = await CoursesSettings.findByIdAndUpdate(
      corsset._id,
      { $pull: { city: { _id: cityId } } },
      { new: true }
    );
    return response.ok(res, updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

addCourseTypeInCourseSetting : async (req, res) => {
  try {
    const { courseTypeName, courseTypeDescription = '' } = req.body;
    if (!courseTypeName) {
      return res.status(400).json({ message: 'courseTypeName is required' });
    }

    let corsset = await CoursesSettings.findOne();
    if (!corsset) {
      const newSetting = new CoursesSettings({ course_types: [{ name: courseTypeName, description: courseTypeDescription }] });
      await newSetting.save();
      return response.ok(res, newSetting);
    }

    const updatedSetting = await CoursesSettings.findByIdAndUpdate(
      corsset._id,
      { $push: { course_types: { name: courseTypeName, description: courseTypeDescription } } },
      { new: true }
    );
    return response.ok(res, updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

updateCourseTypeInCourseSetting : async (req, res) => {
  try {
    const { courseTypeId, courseTypeName, courseTypeDescription } = req.body;
    if (!courseTypeId || !courseTypeName) {
      return res.status(400).json({ message: 'courseTypeId and courseTypeName are required' });
    }

    const updateFields = { 'course_types.$.name': courseTypeName };
    if (courseTypeDescription !== undefined) {
      updateFields['course_types.$.description'] = courseTypeDescription;
    }

    const updatedSetting = await CoursesSettings.findOneAndUpdate(
      { 'course_types._id': courseTypeId },
      { $set: updateFields },
      { new: true }
    );
    if (!updatedSetting) {
      return res.status(404).json({ message: 'Course type not found' });
    }
    return response.ok(res, updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

toggleCourseTypePaidStatus : async (req, res) => {
  try {
    const { courseTypeId, isPaid } = req.body;
    if (!courseTypeId || isPaid === undefined) {
      return res.status(400).json({ message: 'courseTypeId and isPaid are required' });
    }

    const updatedSetting = await CoursesSettings.findOneAndUpdate(
      { 'course_types._id': courseTypeId },
      { $set: { 'course_types.$.isPaid': isPaid } },
      { new: true }
    );
    if (!updatedSetting) {
      return res.status(404).json({ message: 'Course type not found' });
    }
    return response.ok(res, updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

deleteCourseTypeInCourseSetting : async (req, res) => {
  try {
    const { courseTypeId } = req.body;
    if (!courseTypeId) {
      return res.status(400).json({ message: 'courseTypeId is required' });
    }

    const corsset = await CoursesSettings.findOne();
    if (!corsset) {
      return res.status(404).json({ message: 'CoursesSettings not found' });
    }

    const updatedSetting = await CoursesSettings.findByIdAndUpdate(
      corsset._id,
      { $pull: { course_types: { _id: courseTypeId } } },
      { new: true }
    );
    return response.ok(res, updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},
}
