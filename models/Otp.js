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
    createdAt: {
        type: Date,
        default: Date.now
    }
    
    
})

async function sendVerificationEmail(email,otp){
    try{
        console.log("printing in otp model before sending mail")
        const mailResponse=await mailSender(email,"verification email from studynotion",otp)
        console.log("printing in otp model after sending mail")

    }
    catch(err){
        console.log("error while sending mail",err)
        throw err;
    }
}

otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    console.log("printing in otp model")
    next()
})

module.exports=mongoose.model("OTP",otpSchema)