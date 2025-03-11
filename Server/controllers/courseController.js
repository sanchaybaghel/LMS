const Course = require('../models/Course.js');
const User = require('../models/User.js');

const getAllCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator' });
            res.json({ success: true, courses });
            return courses
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get course by ID
const getCouresId = async (req, res) => {
    const { id } = req.params;
    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' });
        
        // Check if courseContent is defined
        if (courseData && courseData.courseContent) {
            // Remove lecture URL if isPreviewFree is false
            courseData.courseContent.forEach(chapter => {
                chapter.chapterContent.forEach(lecture => {
                    if (!lecture.isPreviewFree) {
                        lecture.lectureUrl = "";
                    }
                });
            });
        }

        res.json({ success: true, courseData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

module.exports = { getAllCourse, getCouresId };