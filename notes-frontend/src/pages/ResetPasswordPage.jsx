import { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

function ResetPasswordPage(){

 const [password,setPassword] = useState("");

 const location = useLocation();
 const navigate = useNavigate();

 const email = location.state?.email;

 const handleSubmit = async(e)=>{
  e.preventDefault();

  try{

   await axiosClient.post("/auth/reset-password",{
    email,
    password
   });

   toast.success("Password reset successful");

   navigate("/login");

  }catch(err){

   toast.error("Reset failed");

  }
 };

 return(

  <div className="min-h-screen flex items-center justify-center">

   <form
    onSubmit={handleSubmit}
    className="bg-white p-6 rounded shadow w-96"
   >

    <h2 className="text-xl font-bold mb-4 text-center">
     Reset Password
    </h2>

    <input
     type="password"
     placeholder="New password"
     value={password}
     onChange={(e)=>setPassword(e.target.value)}
     className="w-full p-2 border rounded mb-4"
    />

    <button className="w-full bg-green-600 text-white p-2 rounded">
     Reset Password
    </button>

   </form>

  </div>
 );
}

export default ResetPasswordPage;