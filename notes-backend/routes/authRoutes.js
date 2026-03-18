import express from "express";
import { register, login, forgotPassword, verifyOTP, resetPassword, verifyRegisterOtp } from "../controllers/authController.js";
import passport from "passport";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req,res)=>{

 try{

  const {token} = req.body;

  const ticket = await client.verifyIdToken({
   idToken: token,
   audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  const {email,name} = payload;

  let user = await User.findOne({email});

  if(!user){

   user = await User.create({
    name,
    email,
    password:"google-login",
    googleAuth: true
   });

  }

  const jwtToken = jwt.sign(
   {id:user._id},
   process.env.JWT_SECRET,
   {expiresIn:"1d"}
  );

  res.json({token:jwtToken,user});

 }catch(err){

  res.status(500).json({
   message:"Google login failed"
  });

 }

});


router.get(
 "/google",
 passport.authenticate("google",{scope:["profile","email"]})
);

router.get(
 "/google/callback",
 passport.authenticate("google",{session:false}),
 (req,res)=>{
  res.redirect("http://localhost:5173/notes");
 }
);

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/verify-register-otp", verifyRegisterOtp);

export default router;