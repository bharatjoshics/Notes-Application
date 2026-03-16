import User from "../models/User.js";
import transporter from "../config/mailer.js";
import { generateOTP } from "../utils/otpGenerator.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pendingUser from "../models/pendingUser.js";
import { sendEmail } from "../utils/sendEmail.js";
 // Registration
export const register = async (req,res)=>{
 try {

  const { name, email, password } = req.body || {};

  if(!name || !email || !password){
   return res.status(400).json({
    message:"All fields are required"
   });
  }

  const existingUser = await User.findOne({email});

  if(existingUser){
   return res.status(400).json({
    message:"User already exists"
   });
  }

  const hashedPassword = await bcrypt.hash(password,10);

  await pendingUser.deleteMany({email}); //To remove old attempt
  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  await pendingUser.create({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpiry
  });

  // await transporter.sendMail({
  //   from: "Notes-app@mail.com",
  //   to: email,
  //   subject: "Verify Your Account",
  //   html: `<h2>Your OTP: ${otp}</h2>`
  // });

  sendEmail(
    email,
    "Verify Your Account",
    `<h2>Your OTP: ${otp}</h2>`
  )

  res.json({
   message:"OTP sent to your email"
  });

 } catch(err){
  console.error(err);
  res.status(500).json({
   message:"Registration failed"
  });
 }
};


// Verify Register OTP
export const verifyRegisterOtp = async (req,res)=>{

 try{

  const {email,otp} = req.body;

  const pU = await pendingUser.findOne({email});

  if(!pU){
   return res.status(404).json({
    message:"Registration Session Expired"
   });
  }

  if(pU.otp !== otp){
   return res.status(400).json({
    message:"Invalid OTP"
   });
  }

  if(Date.now() > pU.otpExpiry){
   return res.status(400).json({
    message:"OTP expired"
   });
  }

  await User.create({
   name: pU.name,
   email: pU.email,
   password: pU.password,
  });

  await pendingUser.deleteOne({email});

  res.json({
   message:"Account Created Successfully"
  });

 }catch(err){
  res.status(500).json({
   message:"Verification failed"
  });
 }
};


// Login
export const login = async (req,res)=>{

 const {email,password} = req.body;

 const user = await User.findOne({email});
 if(!user){
  return res.status(400).json({message:"Invalid credentials"});
 }

 const isMatch = await bcrypt.compare(password,user.password);

 if(!isMatch){
  return res.status(400).json({message:"Invalid credentials"});
 }

 const token = jwt.sign(
  {id:user._id},
  process.env.JWT_SECRET,
  {expiresIn:"1d"}
 );

 res.json({token, 
    user: {
        id: user._id,
        name: user.name,
        email: user.email
    }
 });
};


//Forget Password
export const forgotPassword = async (req,res) => {

 const { email } = req.body;

 const user = await User.findOne({email});

 if(!user){
  return res.status(404).json({
   message:"User not found"
  });
 }

 const otp = generateOTP();

 user.resetOTP = otp;
 user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;

 await user.save();

 await transporter.sendMail({
  to: user.email,
  subject: "Password Reset OTP",
  html: `<h1>Your OTP is: ${otp}</h1>`
 });

 res.json({
  message:"OTP sent to your email"
 });
};


//Verify OTP
export const verifyOTP = async (req,res)=>{

 const {email,otp} = req.body;

 const user = await User.findOne({email});

 if(!user){
  return res.status(404).json({
   message:"User not found"
  });
 }

 if(user.resetOTP !== otp){
  return res.status(400).json({
   message:"Invalid OTP"
  });
 }

 if(Date.now() > user.resetOTPExpiry){
  return res.status(400).json({
   message:"OTP expired"
  });
 }

 res.json({
  message:"OTP verified"
 });

};


//Reset Password
export const resetPassword = async (req,res)=>{

 const {email,password} = req.body;

 const user = await User.findOne({email});

 const hashedPassword = await bcrypt.hash(password,10);

 user.password = hashedPassword;
 user.resetOTP = undefined;
 user.resetOTPExpiry = undefined;

 await user.save();

 res.json({
  message:"Password reset successful"
 });

};