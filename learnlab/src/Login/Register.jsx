import { useState } from "react";
import logo from "../Images/logo1.png";
import UserService from "../Login/UserService";
import { useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai"; 

export default function SignupForm() {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    gender: "",
    age: "",
    password: "",
  });

  const [disableInputs, setDisableInputs] = useState(false);
  const [showSecretPopup, setShowSecretPopup] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      if (value === "ADMIN") {
        setShowSecretPopup(true); 
      } else {
        setDisableInputs(false); 
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSecretSubmit = () => {
    if (secretKey === "learnlab") {
      setShowSecretPopup(false);
      setDisableInputs(false); 
    } else {
      alert("Incorrect Secret Key! Disabling other inputs.");
      setShowSecretPopup(false);
      setDisableInputs(true); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.register(formData, token);

      if (response.status === 400) {
        alert("Incorrect password! Disabling other inputs...");
        setDisableInputs(true);
        return;
      }

      setFormData({
        name: "",
        email: "",
        age: "",
        gender: "",
        password: "",
        role: "",
      });

      setShowSuccessPopup(true); 
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/LoginForm"); 
      }, 3000); 
    } catch (error) {
      console.error("Error registering user", error);
      alert("An error occurred while registering user");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Company Logo" className="w-24" />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account!
        </h2>
        <p className="text-center text-gray-600 mb-5">
          Join us today! Enter your details to create your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Dropdown (Always Enabled) */}
          <select
            name="role"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="">👤 Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>

          {/* Full Name */}
          <input
            type="text"
            name="name"
            placeholder="👤 Full Name"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={disableInputs}
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="✉️ Email"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={disableInputs}
          />

          {/* Gender Dropdown */}
          <select
            name="gender"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            value={formData.gender}
            onChange={handleInputChange}
            required
            disabled={disableInputs}
          >
            <option value="">⚥ Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Age */}
          <input
            type="number"
            name="age"
            placeholder="🎂 Age"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            value={formData.age}
            onChange={handleInputChange}
            required
            disabled={disableInputs}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="🔒 Password"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={disableInputs}
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            disabled={disableInputs}
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <AiOutlineCheckCircle className="text-green-500 text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-center text-green-500">
              Registration Successful!
            </h3>
            <p className="text-center text-gray-600 mt-2">
              You can now log in with your credentials.
            </p>
          </div>
        </div>
      )}

      {/* Secret Code Popup Modal */}
      {showSecretPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-3 text-center">Enter Secret Key</h3>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="🔑 Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSecretSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Verify
              </button>
              <button
                onClick={() => {
                  setShowSecretPopup(false);
                  setFormData({ ...formData, role: "" });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}