const cloudinary=require("cloudinary").v2

exports.uploadImageToCloudinary=async(file,folder,height,quality)=>{
    try{
        const options={folder}
        if(height){
            options.height=height
        }
        if(quality){
            options.quality=quality
        }

        options.resource_type="auto"
        return await cloudinary.UploadStream.upload(file,tempFilePath,options)

    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"failed to upload to cloudinary"
        })
    }
}