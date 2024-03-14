const User =require("../models/User")
const mailSender=require("../utilities/mailSender")
const bcrypt=require("bcrypt")
exports.resetPasswordToken=async(req,res)=>{
    try{
        const email=req.body.email
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"unregistered user"
            })
        }

        const token=crypto.randomUUID()
        const updatedDetails=await User.findOneAndUpdate({email:email},{
            token:token,
            resetPasswordExpires:Date.now()+ 5*60*1000
        },
        {new:true})
        
        const url=`http://localhost:3000/update-password/${token}`
        await mailSender(email,
            "password reset link",
            `password reset link: ${url}`
            
            )

            return res.status(200).json({
                success:true,
                message:"password reset token genereted successfully and mail sent"
            })

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"something went wrong while generating password reset token"
        })
        

    }
}

exports.resetPassword=async(req,res)=>{
    try{

        const {password,confirmPassword,token}=req.body
        if(password !==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"both passwords should be the same"
            })
        }

        const userDetails=await User.findOne({token})
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"token is invalid"
            })
        }

        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success:false,
                message:"token expired"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10)

        await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true})

        return res.status(200).json({
            success:true,
            message:"password reset successful"
        })

    }
    catch(err){
        return res.status(404).json({
            success:false,
            message:"something went wrong while reset password"
        })
    }
}