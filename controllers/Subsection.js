const Section=require("../models/Section")
const SubSection = require("../models/SubSection")
const Subsectioin=require("../models/SubSection")
 const uploadImageToCloudinary =require("../utilities/imageUploader")

exports.createSubSection=async(req,res)=>{
    try{
        const {sectionId,title,timeDuration,description}=req.body
        const video=req.files.videoFile
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:true,
                message:"data missing",
                
            })
        }

        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        const subSectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })

        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},{$push:{
            subSection:subSectionDetails._id
        }},{new:true})

        return res.status(200).json({
            success:true,
            message:"subsection created successfully",
            updatedSection
        })


    }
    catch(err){
        return res.status(400).json({
            success:true,
            message:"cant create sub section",
            
        })
    }
}