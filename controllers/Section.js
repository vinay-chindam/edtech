
const Course=require("../models/Course")
const Section=require("../models/Section")
exports.createSection=async(req,res)=>{
    try{

        const {sectionName,courseId}=req.body
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"missing proporties"
            })
        }
        const newSection=await sectionName.create({sectionName})
        const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                            courseId,
                                                            {
                                                                $push:{
                                                                    courseContent:newSection._id
                                                                }
                                                            },{new:true}
        )

        return res.status(200).json({
            success:true,
            message:"section created successfully",
            updatedCourseDetails
        })

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"cannot create section"
        })
    }
}

exports.updateSection=async(req,res)=>{
    try{
        const {sectionName,sectionId}=req.body
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"missing proporties"
            })
        }
        const section=await Section.findByIdAndUpdate({sectionId},{sectionName},{new:true})
        return res.status(200).json({
            success:true,
            message:"section updated successfully",
            updatedCourseDetails
        })


    }
    catch(err){

    }
}

exports.deleteSection=async(req,res)=>{
    try{

        const {sectionId}=req.params
        await Section.findByIdAndDelete({sectionId})
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
            updatedCourseDetails
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"cannot delete section"
        })
    }
}