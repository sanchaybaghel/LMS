
const express=require('express')
const { getUserData, userEnrolledCourses,purchaseCourse } = require('../controllers/userController.js')


const userRouter=express.Router()

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)
userRouter.post('/purchase',purchaseCourse)

module.exports=userRouter;