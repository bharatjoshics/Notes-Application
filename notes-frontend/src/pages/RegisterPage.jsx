import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterPage(){

 const [name, setName] = useState("");
 const [username, setUsername] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const navigate = useNavigate();

 const handleRegister = async (e) => {
  e.preventDefault();

  try {

    await register({name, username, email, password});

    toast.success("OTP Sent to your Email");

    navigate("/verify-register-otp", {state: {email}});

  } catch (err) {

    const message =
      err.response?.data?.message || "Registration failed";

    toast.error(message);

  }
};

 return(
    <div className="flex items-center justify-center h-screen bg-gray-100">
        <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
            <input type="text" className="w-full border p-2 mb-3 rounded"  placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input type="text" className="w-full border p-2 mb-3 rounded"  placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
            <input type="email" className="w-full border p-2 mb-3 rounded" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" className="w-full border p-2 mb-3 rounded"  placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className="w-full bg-blue-500 text-white p-2 rounded">Register</button>

            <div className="mt-3">
                <h3>Already have an account? <span className="text-blue-700"><Link to="/login">Login</Link></span></h3>
            </div>
        </form>
   </div>
 );
}

export default RegisterPage;