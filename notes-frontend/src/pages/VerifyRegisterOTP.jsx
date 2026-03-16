import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyRegisterOTP } from "../services/authService";
import { toast } from "react-toastify";

export default function VerifyRegisterOTP() {

 const [otp,setOtp] = useState("");

 const navigate = useNavigate();
 const location = useLocation();

 const email = location.state?.email;

 const handleVerify = async (e) => {

  e.preventDefault();

  try{

   const res = await verifyRegisterOTP({
    email,
    otp
   });

   toast.success(res.message);

   navigate("/login");

  }catch(err){

   const message =
    err.response?.data?.message || "Verification failed";

   toast.error(message);

  }

 };

 return (

  <div className="flex justify-center items-center h-screen">

   <form
   onSubmit={handleVerify}
   className="bg-zinc-900 p-6 rounded-lg w-96"
   >

   <h2 className="text-white text-xl mb-4">
    Verify OTP
   </h2>

   <input
   type="text"
   placeholder="Enter OTP"
   value={otp}
   onChange={(e)=>setOtp(e.target.value)}
   className="w-full p-2 rounded bg-zinc-800 text-white mb-4"
   />

   <button
   type="submit"
   className="w-full bg-blue-600 p-2 rounded text-white"
   >
    Verify
   </button>

   </form>

  </div>

 );

}