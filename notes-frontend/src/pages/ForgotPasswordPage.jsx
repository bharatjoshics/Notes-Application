import { useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {

  const [email,setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axiosClient.post("/auth/forgot-password",{email});

      toast.success("OTP sent to your email");

      navigate("/verify-otp",{state:{email}});

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Something went wrong"
      );

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96"
      >

        <h2 className="text-xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Send OTP
        </button>

      </form>

    </div>

  );
}

export default ForgotPasswordPage;