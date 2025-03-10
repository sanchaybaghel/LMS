const express = require('express');
const { updateRoleToEducator, addCourse, getEducatorCourses,educatorDashboardData,getEnrolledStudentsData } = require('../controllers/educatorController');
const upload = require('../configs/multer');
const protectEducator = require('../middlewares/authMiddleware.js');

const educatorRouter = express.Router();

educatorRouter.get('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard', protectEducator,educatorDashboardData );

educatorRouter.get('/enrolled-students', protectEducator,getEnrolledStudentsData );


module.exports = educatorRouter;