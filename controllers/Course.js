const Course=require("../models/Course")
const Tag=require("../models/Tags")
const User=require("../models/User")

const {uploadImageToCloudinary}=require("../utilities/imageUploader")
exports.createCourse=async(req,res)=>{
    try{
        const {courseName,courseDescription,whatYouwillLearn,price,tag}=req.body
        const thumbnail=req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouwillLearn ||!price || ! thumbnail){
            return res.status(404).json({
                success:false,
                message:"All fielda are required"
            })
        }

        const userId=req.user.id
        const instructorDetails=await User.findById({userId})

        console.log("instructor details",instructorDetails)

        if(! instructorDetails){
            return res.status(404).json({
                success:false,
                message:"invalid instructor"
            })
        }
        const tagDetails=await Tag.findById({tag})

        if(! tagDetails){
            return res.status(404).json({
                success:false,
                message:"invalid tag"
            })
        }
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouwillLearn:whatYouwillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url
        })

        await User.findByIdAndUpdate(
            {_id:instructorDetails._id,},
            {
                $push:{
                    courses:newCourse._id
                }
            }
            
            )
        //update tag
        await Tag.findByIdAndUpdate(
            {id:tagDetails._id},
            {
                $push:{
                    course:newCourse._id
                }

            }
        )
        return res.status(200).json({
            success:false,
            message:"course created successfully"
        })
    }

    catch(err){
        return res.status(400).json({
            success:false,
            message:"unable to create course"
        })

    }
}

exports.showAllCourses=async (req,res)=>{
    try{

        const allCourses=await Course.find({},{courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReview:true,
                                                studentsEnrolled:true,

        }).populate("instructor")
        .exec()

        return res.status(200).json({
            success:true,
            message:"all courses retrived successfully"
        })

    }
    catch(err){
        return res.status(404).json({
            success:false,
            message:"cannot get all courses"
        })
    }
}