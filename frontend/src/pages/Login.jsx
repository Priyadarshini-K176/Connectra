/* eslint-disable react/prop-types */
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../utils/authSlice";
import { clearConnectionRequests } from "../utils/connectionsSlice";
import { clearFollowerRequests } from "../utils/followersSlice";
import { clearFollowingRequests } from "../utils/followingSlice";
import { clearIgnoredRequests } from "../utils/ignoredRequestsSlice";
import { clearInterestedRequests } from "../utils/interestedRequestsSlice";
import { clearRejectedRequests } from "../utils/rejectedRequestsSlice";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isUsername, setIsUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", username: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/feed";

  const validateInputs = () => {
    const newErrors = { email: "", username: "", password: "" };
    if (!isUsername && (userId.trim() === "" || !/^\S+@\S+\.\S+$/.test(userId))) {
      newErrors.email = "Valid Email Required";
    }
    if (isUsername && userId.trim().length < 3) {
      newErrors.username = "Username too short";
    }
    if (password.trim().length <= 0) {
      newErrors.password = "Password Required";
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    try {
      const data = isUsername ? { username: userId, password } : { email: userId, password };
      const res = await axios.post(import.meta.env.VITE_BackendURL + "/login", data, { withCredentials: true });

      if (res.data.success === false) {
        toast.error(res.data.message || "Auth Failed");
      } else {
        toast.success("Welcome Back!");
        dispatch(addUser(res.data.user));
        [clearInterestedRequests, clearConnectionRequests, clearFollowerRequests, clearFollowingRequests, clearIgnoredRequests, clearRejectedRequests, login].forEach(fn => dispatch(fn()));
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error("Network Error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-4 font-sans selection:bg-indigo-100">
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-8 sm:p-12 text-center">

          {/* Header to match your image */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Start building and connecting
            </p>
          </div>

          <div className="space-y-4">
            {/* Input: Identifier (Email or Username) */}
            <div className="text-left">
              <input
                className="w-full rounded-lg border border-gray-200 bg-white p-3.5 text-gray-900 outline-none transition-all focus:border-indigo-500 placeholder:text-gray-400"
                type={isUsername ? "text" : "email"}
                placeholder={isUsername ? "Username" : "Email"}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              {(errors.email || errors.username) && (
                <p className="text-[11px] text-red-500 mt-1 ml-1">{isUsername ? errors.username : errors.email}</p>
              )}
            </div>

            {/* Input: Password */}
            <div className="text-left">
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-gray-200 bg-white p-3.5 text-gray-900 outline-none transition-all focus:border-indigo-500 placeholder:text-gray-400"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Login Action */}
            <button
              className="w-full rounded-lg bg-[#4f46e5] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#4338ca] active:scale-[0.99] mt-2 shadow-md shadow-indigo-100"
              onClick={handleLogin}
            >
              Login
            </button>

            {/* Toggle Login Mode */}
            <button
              onClick={() => {
                setIsUsername(!isUsername);
                setUserId("");
                setErrors({ email: "", username: "", password: "" });
              }}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors mt-2"
            >
              Login with {isUsername ? "Email" : "Username"} instead
            </button>
          </div>

          {/* Footer to match your image */}
          <div className="mt-8 pt-6 border-t border-gray-50 text-[13px]">
            <p className="text-gray-500">
              By logging in, you agree to our{" "}
              <a href="#" className="text-gray-600 underline">Terms</a> and{" "}
              <a href="#" className="text-gray-600 underline">Privacy Policy</a>
            </p>
            <p className="mt-4 text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;