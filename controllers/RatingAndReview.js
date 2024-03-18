const RatingAndReview=require("../models/RATINGAndReview")
const Course=require("../models/Course")

exports.createRating=async(req,res)=>{
    try{

        const userId=req.user.id
        const{rating ,review,courseId}=req.body
        const courseDetails=await Course.findOne({_id:courseId,
                                        studentsEnrolled:{$elementMatch:{$eq:userId}}
        
        
        })

        if(!courseDetails){
            res.status(400).json({
                success:false,
                message:"un enrolled student"
            })
        }

        const alreadyReviewed =await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        })
        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"already reviewed"
            })
        }
        const ratingReview=await RatingAndReview.create({
                                rating,
                                review,
                                course:courseId,
                                user:userId
        })

        const updatedCourseDeatils=await Course.findByIdAndUpdate({_id:courseId},
                                                {
                                                    $push:{
                                                        ratingAndReview:ratingReview._id
                                                    }
                                                },
                                                {new:true}
            
            
            )

            console.log(updatedCourseDeatils)




         return res.status(200).json({
            success:true,
            message:"rating and review created successfully"
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"cant create rating and review"
        })
    }
}

exports.getAverageRating=async(req,res)=>{
    try{

        const courseId=req.body.courseId
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    courses:new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        if(result.length>0){
            return res.status(200).json({
                success:true,
                message:"average rating fetched",
                averageRating:result[0].averageRating
            })
        }
        return res.status(200).json({
            success:true,
            message:"average rating is 0 , no rating are given"
        })


    }
    catch(err){
        res.status(400).json({
            success:false,
            message:"cant get average rating"
        })
    }
}

exports.getAllRating=async(req,res)=>{
    try{
            const allReviews=await RatingAndReview.find({})
                                                    .sort({rating:"desc"})
                                                    populate({
                                                        path:"user",
                                                        select:"firstName lastName email image"
                                                    }).populate({
                                                        path:"course",
                                                        select:"courseName"
                                                    })
                                                    .exec()
            return res.status(200).json({
                success:true,
                message:"all reviews fetched successfully"
            })
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:"cant get rating details"
        })
    }
}