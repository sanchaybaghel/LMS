
const express=require('express')
const {getAllCourse,getCouresId}=require('../controllers/courseController')

const couresRouter=express.Router();

couresRouter.get('/all',getAllCourse)
couresRouter.get('/:id',getCouresId)

module.exports=couresRouter;
