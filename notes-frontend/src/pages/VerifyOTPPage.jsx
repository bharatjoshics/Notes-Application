import { useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOTPPage(){

 const [otp,setOTP] = useState("");

 const location = useLocation();
 const navigate = useNavigate();

 const userid = location.state?.userid;

 const handleSubmit = async(e)=>{
  e.preventDefault();

  try{

   await axiosClient.post("/auth/verify-otp",{userid,otp});

   toast.success("OTP verified");

   navigate("/reset-password",{state:{userid}});

  }catch(err){

   toast.error(
    err.response?.data?.message || "Verification failed"
   );

  }
 };

 return(

  <div className="min-h-screen flex items-center justify-center">

   <form
    onSubmit={handleSubmit}
    className="bg-white p-6 rounded shadow w-96"
   >

    <h2 className="text-xl font-bold mb-4 text-center">
     Verify OTP
    </h2>

    <input
     type="text"
     placeholder="Enter OTP"
     value={otp}
     onChange={(e)=>setOTP(e.target.value)}
     className="w-full p-2 border rounded mb-4"
    />

    <button className="w-full bg-blue-600 text-white p-2 rounded">
     Verify OTP
    </button>

   </form>

  </div>
 );
}

export default VerifyOTPPage;