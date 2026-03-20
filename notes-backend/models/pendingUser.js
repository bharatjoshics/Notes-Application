import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({

 name:String,
 username: String,
 email:String,
 password:String,

 otp:String,

 otpExpiry:Date

});

export default mongoose.model("PendingUser", pendingUserSchema);