const Course = require("../models/Course.js")
const Purchase = require("../models/purchase.js")
const User = require("../models/User.js")
const stripe=require('stripe')
//get User data
const getUserData=async (req,res)=>{
    try{
        const userId=req.auth.userId 
        const user=await User.findById(userId)
        if(!user){
            return res.json({success:false,message:'User Not found'})
        }
        res.json({success:true,user})
    }
    catch(error){
        res.status(500).json({success:false,message:error.message})
    }
}
//user enrolled cousres with lecture links

const userEnrolledCourses=async (req,res)=>{
    try{
        const userId=req.auth.userId
        const userData=await User.findById(userId).populate('enrolledCourses')
        res.json({success:true,enrolledCourses:userData.enrolledCourses})
    }
    catch(error){
        res.status(500).json({success:false,message:error.message})
    }
}
// purchase Course

const purchaseCourse=async (req,res)=>{
    try{
        const {courseId}=req.body
        const {origin}=req.headers
        const userId=req.auth.userId
        const userData=await User.findById(userId)
        const courseData=await Course.findById(courseId)

        if(!userData || !courseData){
            res.status(400).json({success:false,messsage:'Data Not Found'})
        }

        const purchaseData={
            courseId:courseData._id,
            userId,
            amount:(courseData.coursePrice-courseData.discount * courseData.coursePrice/100).toFixed(2),
        }

        const newPurchase=await Purchase.create(purchaseData);

        //stripe Gateway Initialize

        const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);

        const currency=process.env.CURRENCY.toLowerCase();

        // Creating line items to for stripe

        const line_items=[{
            price_data:{
                currency,
                product_data:{
                    name:courseData.courseTitle
                },
                unit_amount:Math.floor(newPurchase.amount)*100
            },
            quantity:1
        }]
        const session=await stripeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-enrollments`,
            cancel_url:`${origin}/`,
            line_items:line_items,
            mode:'payment',
            metadata:{
                purchaseId:newPurchase._id.toString()
            }
        })
        res.json({success:true,session_url:session.url})


    }catch(error){
        
        res.status(500).json({success:false,message:error.message});
    }
}

module.exports={
    getUserData,userEnrolledCourses,purchaseCourse
}
