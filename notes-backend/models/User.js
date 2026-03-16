import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
  type: Boolean,
  default: false
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  
  emailVerificationToken: String,
  resetOTP: String,
  resetOTPExpiry: Date,
  
  googleAuth: {
  type: Boolean,
  default: false
  }
});

export default mongoose.model("User", userSchema);