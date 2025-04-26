import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import companyLogo from "../Images/logo1.png"; 
import { useNavigate } from 'react-router-dom';
import UserService from '../Login/UserService';

export default function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    setTimeout(async () => {
      try {
        const userData = await UserService.login(email, password);
        console.log(userData);

        if (userData.token) {
          localStorage.setItem('token', userData.token);
          localStorage.setItem('role', userData.role);
          localStorage.setItem("name", userData.name);
          localStorage.setItem('email', userData.email);

          if (userData.role === "USER") {
            navigate("/Home");
          } else if (userData.role === "ADMIN") {
            navigate("/AdminManagementDashboard");
          }
        } else {
          setError(userData.message);
        }
      } catch (error) {
        setError("An error occurred while logging in. Please try again.");
      } finally {
        setLoading(false); 
      }
    }, 2000); 
  };

  const handleGoogleSuccess = (response) => {
    console.log("Google Login Success:", response);
  };

  const handleGoogleFailure = (error) => {
    console.log("Google Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-black">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* Company Logo */}
          <div className="flex justify-center mb-4">
            <img src={companyLogo} alt="Company Logo" className="w-24 h-30" />
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 mb-5">Login to your account</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="✉️ Email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Input */}
            <input
              type="password"
              name="password"
              placeholder="🔒 Password"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              disabled={loading} 
            >
              {loading ? "Logging in..." : "Login"} 
            </button>
          </form>

          {/* Google Login Button */}
          <div className="mt-4">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
          </div>

          {/* Signup Link */}
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
