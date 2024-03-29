
const User=require("../models/User")
const Profile=require("../models/Profile")
const OTP=require("../models/Otp")
const otpGenerator=require("otp-generator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const mailSender = require("../utilities/mailSender")


//otp

exports.sendotp=async(req,res)=>{
    try{
        const {email}=req.body
        const checkUserPresent=await User.findOne({email})

        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"user already exists"
            })
        }
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialCharacters:false,
        })
        const result=await OTP.findOne({otp:otp})
        while(result){
            var otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialCharacters:false,
            })
            result=await OTP.findOne({otp:otp})
        }
        const otpPayload={email,otp}
        const otpBody=await OTP.create(otpPayload)
        console.log("otp body",otpBody)


        return res.status(200).json({
            success:true,
            message:"otp generated successfully",
            otp
        })


    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

//signup
exports.signup=async(req,res)=>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            
            otp,
            contactNumber,
        
        }=req.body

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }
        if(password !==confirmPassword){
            return res.status(401).json({
                success:false,
                message:"passwords should match"
            })
        }

        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(402).json({
                success:false,
                message:"user already exists"
            })
        }

        //is something missing

        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(response)

        if(response.length===0){
            return res.status(403).json({
                success:false,
                message:"otp not found"
            })
        }
        else if(otp !== response[0].otp){
            return res.status(400).json({
                success:false,
                message:"otp did not match",
                otp,response
            })
        }
        console.log("otp is",response[0].otp)

        const hashedPassword=await bcrypt.hash(password,10);
        

        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })
        
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: "  dga"
        });
        return res.status(200).json({
            success:true,
            message:"user created successfully",
            user
        })
    }
    catch(err){

        return res.status(400).json({
            success:false,
            message:"something went wrong while creating user",
        
        })

    }
}



exports.login=async(req,res)=>{
    try{

        const{email,password}=req.body;
        if(! email || ! password){
            return res.status(404).json({
                success:false,
                message:"few fields are missing"
            })
        }

        const user=await User.findOne({email}).populate("additionalDetails")
        console.log(user)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"un registered user"
            })
        }

        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType   ,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            user.token=token
            user.password=undefined
            const options={
                expiresIn:new  Date(Date.now()+(3*24*60*60*1000)),
                httpOnly:true
                
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"user logged in successfully"
            })
        }
        else{
            return res.status(404).json({
                success:false,
                message:"password did not match"
            })
        }



    }
    catch(err){
        return res.status(404).json({
            success:false,
            message:"Login failure ! try again"
        })

    }
}

exports.changePassword=async(req,res)=>{
    try{

    }
    catch(err){
        return res.status(404).json({
            success:false,
            message:"Login failure ! try again"
        })
    }
}