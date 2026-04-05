import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../utils/authSlice";
import { clearConnectionRequests } from "../utils/connectionsSlice";
import { clearFollowerRequests } from "../utils/followersSlice";
import { clearFollowingRequests } from "../utils/followingSlice";
import { clearIgnoredRequests } from "../utils/ignoredRequestsSlice";
import { clearInterestedRequests } from "../utils/interestedRequestsSlice";
import { clearRejectedRequests } from "../utils/rejectedRequestsSlice";
import { addUser } from "../utils/userSlice";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const dispatch = useDispatch();

  const validateInputs = () => {
    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    };

    // Email validation
    if (email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Username validation
    if (username.trim().length < 3) {
      newErrors.username = "Username must be more than 3 characters long.";
    }

    // Name validation
    if (firstName.trim().length < 3) {
      newErrors.firstName = "Name must be more than 3 characters long.";
    } else if (
      /[0-9]/.test(firstName) ||
      /[!@#$%^&*(),.?":{}|<>]/.test(firstName)
    ) {
      newErrors.firstName = "Name should contain only characters";
    }
    if (
      (lastName.trim().length > 0 && /[0-9]/.test(lastName)) ||
      /[!@#$%^&*(),.?":{}|<>]/.test(lastName)
    ) {
      newErrors.lastName = "Name should contain only characters";
    }

    // Password validation
    if (password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  // to fetch sign up api
  const handleSignUp = async () => {
    if (!validateInputs()) return;

    try {
      const data = { email, firstName, lastName, username, password };

      const res = await axios.post(
        import.meta.env.VITE_BackendURL+ "/signup",
        data,
        { withCredentials: true }
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        toast.success(res.data.message || "Signup successful!");
        dispatch(login());
        dispatch(addUser(res.data.user));
        dispatch(clearInterestedRequests());
        dispatch(clearConnectionRequests());
        dispatch(clearFollowerRequests());
        dispatch(clearFollowingRequests());
        dispatch(clearIgnoredRequests());
        dispatch(clearRejectedRequests());
        navigate("/profile");
        window.location.reload();
      }
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      if (err.response) {
        // The request was made, and the server responded with a status code that falls out of the range of 2xx
        toast.error(err.response.data.error || "Something went wrong!");
      } else if (err.request) {
        // The request was made, but no response was received
        toast.error("No response from the server. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An unexpected error occurred.");
      }
      console.error(err.message);
    }
  };

  return (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Start building and connecting 🚀
        </p>
      </div>

      <div className="mt-6 space-y-3">

        {/* First Name */}
        {errors.firstName && (
          <p className="text-xs text-red-500">{errors.firstName}</p>
        )}
        <input
          type="text"
          placeholder="First Name"
          className="w-full rounded-lg border px-4 py-3 focus:border-indigo-400 focus:outline-none"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        {/* Last Name */}
        {errors.lastName && (
          <p className="text-xs text-red-500">{errors.lastName}</p>
        )}
        <input
          type="text"
          placeholder="Last Name"
          className="w-full rounded-lg border px-4 py-3 focus:border-indigo-400 focus:outline-none"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        {/* Username */}
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username}</p>
        )}
        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-lg border px-4 py-3 focus:border-indigo-400 focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email */}
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border px-4 py-3 focus:border-indigo-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
        <div className="flex items-center rounded-lg border px-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full py-3 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500"
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>

        {/* Button */}
        <button
          onClick={handleSignUp}
          className="mt-3 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Create Account
        </button>
      </div>

      {/* Footer */}
      <p className="mt-5 text-center text-xs text-gray-500">
        By signing up, you agree to our{" "}
        <span className="underline cursor-pointer">Terms</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-indigo-600 hover:underline">
          Login
        </a>
      </p>

    </div>
  </div>
);
};

export default Signup;