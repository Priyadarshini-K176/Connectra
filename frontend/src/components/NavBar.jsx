import axios from "axios";
import { motion } from "framer-motion";
import { House, LockKeyhole, Menu, UserRoundPen, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiMoon, FiSun } from "react-icons/fi";
import { IoIosChatboxes } from "react-icons/io";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { logout } from "../utils/authSlice";
import { clearConnectionRequests } from "../utils/connectionsSlice";
import { clearFollowerRequests } from "../utils/followersSlice";
import { clearFollowingRequests } from "../utils/followingSlice";
import { clearIgnoredRequests } from "../utils/ignoredRequestsSlice";
import { clearInterestedRequests } from "../utils/interestedRequestsSlice";
import { clearRejectedRequests } from "../utils/rejectedRequestsSlice";
import { cacheResults } from "../utils/searchSlice";
import { removeUser } from "../utils/userSlice";
import ProfileSearchCard from "./ProfileSearchCard";

const NavBar = () => {
  const NAVBAR_LINKS = {
    home: <House size={20} />,
    networks: <Users size={20} />,
    profile: <UserRoundPen size={20} />,
    Premium: <MdOutlineWorkspacePremium size={22} />,
    chat: <IoIosChatboxes size={22} />,
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [showNavbar, setShowNavbar] = useState(false);
  const menuRef = useRef(null);
 
  const [showProfileMenu2, setShowProfileMenu2] = useState(false);
  const profileRef1 = useRef(null);
  const profileRef2 = useRef(null);
  const [search, setSearch] = useState(null);
  const searchCache = useSelector((store) => store.search);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const user = useSelector((store) => store.user);

  if (user?.role === "admin") {
    NAVBAR_LINKS["admin"] = <LockKeyhole size={20} />;
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BackendURL + "/logout",
        {},
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res?.data?.message || "An error occurred");
      } else {
        toast.success(res?.data?.message || "Logout successful!");
        dispatch(clearInterestedRequests());
        dispatch(clearConnectionRequests());
        dispatch(clearFollowerRequests());
        dispatch(clearFollowingRequests());
        dispatch(clearIgnoredRequests());
        dispatch(clearRejectedRequests());
        dispatch(removeUser());
        dispatch(logout());
        return navigate("/");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      return navigate("/");
    }
  };

  useEffect(() => {
    const mainBody = document.querySelector(".main-body");
    mainBody.classList.remove("dark", "light");
    mainBody.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef2.current && !profileRef2.current.contains(event.target)) setShowProfileMenu2(false);
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowNavbar(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getSearchSuggestions = async (query) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/search/?query=${query}&page=1&limit=5`,
        { withCredentials: true },
      );
      setSearch(res.data.result);
      setSearchSuggestions(res.data.result);
      dispatch(cacheResults({ [query]: res.data.result }));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!inputSearchQuery) return;
    const timer = setTimeout(() => {
      if (searchCache[inputSearchQuery]) {
        setSearchSuggestions(searchCache[inputSearchQuery]);
      } else {
        getSearchSuggestions(inputSearchQuery);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearchQuery]);

  return (
    <nav className="fixed top-0 z-50 h-20 w-full border-b border-blue-100 bg-blue-50 shadow-sm" ref={menuRef}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        
        {/* LEFT: Logo & Search */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center">
            <img src={logo} className="w-10 h-10 object-contain" alt="Logo" />
          </NavLink>

          {user && (
            <div className="relative hidden sm:block">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                className="w-48 lg:w-64 rounded-xl border border-blue-100 bg-white px-4 py-2 pl-10 text-xs font-bold text-slate-700 outline-none focus:border-blue-400 transition-all"
                placeholder="Search Workspace..."
                value={inputSearchQuery}
                onChange={(e) => setInputSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                onKeyDown={(e) => e.key === "Enter" && navigate("/search?query=" + inputSearchQuery)}
              />
              {isFocused && inputSearchQuery && (
                <div className="absolute mt-2 w-full rounded-xl border border-blue-100 bg-white p-2 shadow-xl">
                  {searchSuggestions?.length > 0 ? (
                    searchSuggestions.map((s) => (
                      <ProfileSearchCard key={s._id} userData={s} onClick={() => setInputSearchQuery("")} />
                    ))
                  ) : (
                    <div className="p-3 text-center text-[10px] font-bold uppercase text-slate-400">No matches</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Links & Profile */}
        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {Object.keys(NAVBAR_LINKS).map((link) => (
                  <li key={link}>
                    <NavLink
                      to={link === "home" ? "/feed" : "/" + link}
                      className={({ isActive }) =>
                        `flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                          isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-500 hover:bg-blue-100"
                        }`
                      }
                    >
                      {NAVBAR_LINKS[link]}
                    </NavLink>
                  </li>
                ))}
                <li className="relative ml-2" ref={profileRef2}>
                  <button onClick={() => setShowProfileMenu2(!showProfileMenu2)} className="flex items-center">
                    <img src={user?.avatar} className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" alt="Profile" />
                  </button>
                  {showProfileMenu2 && (
                    <div className="absolute right-0 mt-3 w-44 rounded-xl border border-blue-100 bg-white p-2 shadow-xl">
                      <NavLink to="/profile" className="block rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50">Profile</NavLink>
                      <button onClick={handleLogout} className="w-full text-left rounded-lg px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50">Logout</button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className="text-xs font-bold text-blue-600 hover:underline">Login</NavLink>
                <NavLink to="/signup" className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors">Sign Up</NavLink>
              </div>
            )}
            <li>
              <button onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-lg text-blue-500 hover:bg-blue-100">
                {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button onClick={handleShowNavbar} className="rounded-lg p-2 text-blue-600 md:hidden hover:bg-blue-100">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showNavbar && (
        <div className="absolute left-0 top-20 w-full border-b border-blue-100 bg-blue-50 p-6 md:hidden shadow-lg">
          <ul className="flex flex-col gap-4">
            {user && Object.keys(NAVBAR_LINKS).map((link) => (
              <NavLink key={link} to={link === "home" ? "/feed" : "/" + link} onClick={() => setShowNavbar(false)} className="flex items-center gap-4 text-xs font-bold text-blue-600 uppercase">
                {NAVBAR_LINKS[link]} {link}
              </NavLink>
            ))}
            <button onClick={toggleTheme} className="flex items-center gap-4 text-xs font-bold text-blue-600 uppercase">
              {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />} Theme
            </button>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;