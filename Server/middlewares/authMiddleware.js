
const {clerkClient}=require("@clerk/express")

const authenticateUser=((req,res,next)=>{
    console.log("req.auth session in authenticateUser",req.auth.userId)
    if(!req.auth || !req.auth.userId){
        return res.status(401).json({success:false,message:'Unauthorized'})
    }
    next();
})

const protectEducator=async (req , res ,next)=>{
    try{
        const userId=req.auth.userId
        const response=await clerkClient.users.getUser(userId)
        if(response.publicMetadata.role!=='educator'){
            return res.json({success:false,message:'Unauthorized Access'})
        }
        next()
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}
module.exports=protectEducator;
module.exports=authenticateUser;