import axiosClient from "../api/axiosClient";

export const register = async (user)=>{
 const res = await axiosClient.post("/auth/register", user);
 return res.data;
};

export const login = async (user)=>{
 const res = await axiosClient.post("/auth/login", user);
 return res.data;
};

export const verifyRegisterOTP = async(data)=>{
 const res = await axiosClient.post("/auth/verify-register-otp",data);
 return res.data;
};