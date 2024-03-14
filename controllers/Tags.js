const Tag=require("../models/Tags")

exports.createTag=async(req,res)=>{
    try{

        const {name,description}=req.body
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })

        }
        const tagDetails=await Tag.create({
            name:name,
            description:description
        })

        return res.status(200).json({
            success:true,
            message:" tag created successfully"
        })

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"failed to create tag"
        })
    }
}

exports.showAllTags=async(req,res)=>{
    try{
        const allTags=await Tag.find({},{name:true,description:true})
        res.status(200).json({
            success:true,
            message:"all tags returned successfully",
            allTags,
        })

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"cant show tags"
        })
    }
}