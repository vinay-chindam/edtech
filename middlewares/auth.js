const jwt=require("jsonwebtoken")
require("dotenv").config()
const User=require("../models/User")

exports.auth=async(req,res,next)=>{
    try{
        const token=req.body.token
                    || req.cookies.token
                    || req.header("Authorisation").repalce("Bearer ","")
        if(! token){
            return res.status(404).json({
                success:false,
                message:"token missing"
            })
        }

        try{
            const decode=await jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode)
            req.user=decode
        }
        catch(err){
            return res.status(402).json({
                success:false,
                message:"token mismatch"
            })
        }
        next()

    }
    catch(err){
        return res.status(402).json({
            success:false,
            message:"something went wrong while verifying the token"
        })

    }
}

exports.isStudent=async(req,res,next)=>{
    try{

        if(req.user.accountType!=="Student"){
            return res.status(404).json({
                success:false,
                message:"this is protected route for students"
            })
        }

    }
    catch(err){
        return res.status(402).json({
            success:false,
            message:"user role cant be verified ,please try again"
        })

    }

}

exports.isAdmin=async(req,res,next)=>{
    try{

        if(req.user.accountType!=="Admin"){
            return res.status(404).json({
                success:false,
                message:"this is protected route for Admin"
            })
        }

    }
    catch(err){
        return res.status(402).json({
            success:false,
            message:"user role cant be verified ,please try again"
        })

    }

}

exports.isInstructor=async(req,res,next)=>{
    try{

        if(req.user.accountType!=="Instructor"){
            return res.status(404).json({
                success:false,
                message:"this is protected route for instructors"
            })
        }

    }
    catch(err){
        return res.status(402).json({
            success:false,
            message:"user role cant be verified ,please try again"
        })

    }

}

