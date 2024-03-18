const Category=require("../models/Category")

exports.createCategory=async(req,res)=>{
    try{

        const {name,description}=req.body
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })

        }
        const tagDetails=await Category.create({
            name:name,
            description:description
        })

        return res.status(200).json({
            success:true,
            message:" category created successfully"
        })

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"failed to create category"
        })
    }
}

exports.showAllCategories=async(req,res)=>{
    try{
        const allCategories=await Category.find({},{name:true,description:true})
        res.status(200).json({
            success:true,
            message:"all Categories returned successfully",
            allCategories,
        })

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"cant show categories"
        })
    }
}

exports.categoryPageDetails=async(req,res)=>{
    try{
        const {categoryId}=req.body
        const selectCategory =await Category.findById(categoryId)
                                .populate("courses")
                                .exec()

        

        if(!selectCategory){
            return res.status(400).json({
                success:false,
                message:"cant get categoty details"
            })
        }

        const differentCategoties=await Category.find({
            _id:{$ne:categoryId},
        })
        .populate("courses")
        .exec()

        return res.status(200).json({
            success:true,
            message:"these are different categories",
            data:{
                selectCategory,
                differentCategoties
            }
        })

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"cant get category page details"
        })
    }
}