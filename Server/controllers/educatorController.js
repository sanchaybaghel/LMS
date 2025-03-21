const { clerkClient, User } = require('@clerk/express');
const Course = require('../models/Course');
const Purchase = require('../models/purchase');
const userSchema=require('../models/User')
const cloudinary = require('cloudinary').v2; // Ensure correct import

const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        });
        res.json({ success: true, message: 'You can publish a course now' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const userId = req.auth.userId;

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' });
        }

        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = userId;
        

        const newCourse = await Course.create(parsedCourseData);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path); // Correct method call
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();
        res.json({ success: true, message: 'Course Added' });
    } catch (error) {
        console.log("error", error);
        res.json({ success: false, message: error.message });
    }
};

const getEducatorCourses=async (req,res)=>{
    try{
        const educator=req.auth.userId;
        const courses=await Course.find({educator})
        res.json({success:true,courses})
    }
    catch(error){
        // console.log("course is not")
        res.json({success:false,message:error.message})
    }
}

// get educator dashboard data

const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);
        const totalCourses = courses.length;
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Collect unique enrolled student Ids with their course title
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await userSchema.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');
            console.log(students)
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }
        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//get Enrolled Students Data with purchase Data
const getEnrolledStudentsData=async (req,res)=>{
    try{
        const educator=req.auth.userId;
        const courses=await Course.find({educator});
        const coureseIds=courses.map(course=>course._id);
        const purchases=await Purchase.find({
            courseId:{$in:coureseIds},
            status:'completed'
        }).populate('userId','name imageUrl').populate('courseId','courseTitle')
        const enrolledStudents=purchases.map(purchase=>({
            student:purchase.userId,
            courseTitle:purchase.courseId.courseTitle,
            purchaseDate:purchase.createdAt
        }));
        res.json({success:true,enrolledStudents})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

module.exports = { updateRoleToEducator, addCourse,getEducatorCourses,educatorDashboardData,getEnrolledStudentsData };