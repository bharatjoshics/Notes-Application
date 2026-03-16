import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotesPage from "./pages/NotesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Footer from "./components/Footer";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyRegisterOTP from "./pages/VerifyRegisterOTP";

function App(){
  return(
    <div>

      <Routes>

        <Route path="/" element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
          } />

        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>          
          } />

        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
      } />

      <Route path="/verify-register-otp" element={<VerifyRegisterOTP/>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage/>} />
      <Route path="/reset-password" element={<ResetPasswordPage/>} />

      </Routes>

      <ToastContainer position="top-right" />

      <Footer />
   
    </div>
  );
}

export default App;