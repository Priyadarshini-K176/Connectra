/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdOutlineWorkspacePremium,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { abbreviateNumber, capitalize } from "../utils/constants";

const Card = ({ user, index = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const scrollRef = useRef(null);
  const [requestCount, setRequestCount] = useState(null);

  const getRequestCount = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/user/totalStatus/" + (user._id || ""),
        { withCredentials: true }
      );
      setRequestCount(res.data.requestCount);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getRequestCount();
  }, [user._id]);

  const scrollLeft = () => { if (scrollRef.current) scrollRef.current.scrollLeft -= 100; };
  const scrollRight = () => { if (scrollRef.current) scrollRef.current.scrollLeft += 100; };

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col items-center w-[320px] h-[440px] bg-white rounded-2xl border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] ring-1 ring-slate-900/5 transition-all"
    >
      {/* --- TOP ACCENT (Replaces Banner) --- */}
      <div className="h-20 w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-2xl border-b border-slate-100" />

      {/* --- AVATAR SECTION --- */}
      <div className="relative -mt-12 mb-4">
        <div className="size-28 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm">
          <img
            src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Status indicator */}
        <span className="absolute bottom-1 right-2 block h-4 w-4 rounded-full border-2 border-white bg-green-500"></span>
      </div>

      {/* --- USER INFO --- */}
      <div className="flex flex-col items-center px-6 text-center w-full">
        <h2 className="flex items-center gap-1 text-lg font-black text-slate-800 leading-tight">
          {capitalize(user?.firstName)} {capitalize(user?.lastName)}
          {user?.isPremium && <MdOutlineWorkspacePremium className="text-yellow-500 shrink-0" size={18} />}
        </h2>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">@{user.username}</p>
        
        <p className="text-xs font-medium text-slate-500 line-clamp-2 h-8 italic">
          {user.headline || "Available for collaboration"}
        </p>
      </div>

      {/* --- SKILLS SCROLLER --- */}
      <div className="flex items-center w-full px-4 mt-4">
        <button onClick={scrollLeft} className="p-1 text-slate-400 hover:text-blue-600">
          <MdArrowBack size={16} />
        </button>
        
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-hidden whitespace-nowrap scroll-smooth no-scrollbar"
        >
          <div className="flex gap-1.5 py-1">
            {user?.skills?.length > 0 ? (
              user.skills.map((skill) => (
                <span key={skill} className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 border border-slate-200 uppercase tracking-tighter">
                  {capitalize(skill)}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-300 mx-auto">No skills listed</span>
            )}
          </div>
        </div>

        <button onClick={scrollRight} className="p-1 text-slate-400 hover:text-blue-600">
          <MdArrowForward size={16} />
        </button>
      </div>

      {/* --- STATS --- */}
      <div className="flex justify-center gap-8 mt-6 w-full border-y border-slate-50 py-3 bg-slate-50/50">
        <div className="text-center">
          <p className="text-sm font-black text-slate-800 leading-none">
            {requestCount?.followers != null ? abbreviateNumber(requestCount.followers) : "0"}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-slate-800 leading-none">
            {requestCount?.following != null ? abbreviateNumber(requestCount.following) : "0"}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Following</p>
        </div>
      </div>

      {/* --- ACTIONS --- */}
      <div className="absolute bottom-4 left-0 right-0 px-6">
        <Link
          to={"/profile/" + user.username}
          className="block w-full rounded-xl bg-blue-600 py-2.5 text-center text-xs font-black uppercase tracking-widest text-white shadow-md shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
};

export default Card;