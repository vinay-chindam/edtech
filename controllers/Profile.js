const User=require("../models/User")

exports.uodateProfile=async(req,res)=>{
    try{

        const {dateOfBirth="", about="", contactNumber="",gender=""}=req.body
        const id=req.user.id

        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"all fields necessary",
                
            })
        }

        const userDetails=await User.findById(id)
        const profileId=userDetails.additionalDetails
        const profileDetails =await profileId.findById(profileId)

        profileDetails.dateOfBirth=dateOfBirth
        profileDetails.about=about
        profileDetails.gender=gender
        profileDetails.contactNumber=contactNumber
        await profileDetails.save()

        return res.status(200).json({
            success:true,
            message:"profile  updated successfully",
            profileDetails
        })
    }
    catch(err){
        return res.status(200).json({
            success:true,
            message:"cant update profile ",
            
        })
    }
}

exports.deleteProfile=async(req,res)=>{
    try{

        const id=req.user.id
        const userDetails=await User.findById(id)
        if(! userDetails){
            return res.status(400).json({
                success:false,
                message:"user not found",
                
            })
        }

        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        await User.findByIdAndDelete({_id:id})

        return res.status(200).json({
            success:true,
            message:"user deleted successfully",
            
        })

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"deletion of account unsuccessfully",
            
        })
    }
}

exports.getAllUserDetails=async(req,res)=>{
    try{
        const id=req.user._id
        const userDetails=await User.findById(id).populate("additionalDetails").exec()

        return res.status(200).json({
            success:true,
            message:"user details retrived successfully",
            
        })

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"getting users un successfully",
            
        })
    }
}