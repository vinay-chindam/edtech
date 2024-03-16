const mongoose=require("mongoose")

const sectioinSchema=new mongoose.Schema({
    sectionName:{
        type:String,
    },
    subSection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subsectioin",
    }]
})

module.exports=mongoose.model("Section",sectioinSchema)