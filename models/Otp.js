const mongoose=require("mongoose");
const mailSender = require("../utilities/mailSender");

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()*60*1000
    }
    
})

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email,"verification email from studynotion",otp)

    }
    catch(err){
        console.log("error while sending mail",err)
        throw err;
    }
}

otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next()
})

module.exports=mongoose.model("OTP",otpSchema)