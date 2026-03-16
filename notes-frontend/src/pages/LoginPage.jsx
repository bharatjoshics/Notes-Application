import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import axiosClient from "../api/axiosClient";

function LoginPage(){

 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const navigate = useNavigate();

 const handleLogin = async (e)=>{
  e.preventDefault();

  try{
    const data = await login({email,password});
    localStorage.setItem("token",data.token);
    localStorage.setItem("user",JSON.stringify(data.user));
    navigate("/");
  } catch(err){
    const message = err.response?.data?.message || "Login Failed"
    toast.error(message);
  }

 };

 return(
    <div className="flex items-center justify-center h-screen bg-gray-100">

    <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
    >

    <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

    <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
    />

    <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="w-full border p-2 rounded"
    />

    <p className="text-sm text-right mb-3">
        <a
            href="/forgot-password"
            className="text-blue-500 hover:underline"
        >
            Forgot password?
        </a>
    </p>

    <button className="w-full bg-blue-500 text-white p-2 rounded">
        Login
    </button>

    <div className="mt-3 mb-3">
        <h3>Don't have an account? <span className="text-blue-700"><Link to="/register">Register</Link></span></h3>
    </div>

    <GoogleLogin
        onSuccess={async (credentialResponse)=>{

        const res = await axiosClient.post("/auth/google-login",{
        token:credentialResponse.credential
        });

        localStorage.setItem("token",res.data.token);

        window.location.href="/";

        }}
        onError={()=>{
        console.log("Google Login Failed");
        }}
    />

    </form>

    </div>
 );
}

export default LoginPage;