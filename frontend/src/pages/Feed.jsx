/* eslint-disable react/prop-types */
import axios from "axios";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaSpinner, FaThumbsDown, FaThumbsUp, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Card from "../components/Card";
import { addFeed, removeRequest } from "../utils/feedSlice";

const MotionCard = ({ user, index, totalCards, requestRef }) => {
  const dispatch = useDispatch();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const combinedOpacity = useTransform([x, y], ([latestX, latestY]) => {
    const opacityFromX = 1 - Math.abs(latestX) / 1000;
    return Math.max(0.6, opacityFromX);
  });

  const scaleThumbsUp = useTransform(x, [0, 100, 200], [0, 0.5, 1.5]);
  const scaleThumbsDown = useTransform(x, [-200, -100, 0], [1.5, 0.5, 0]);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  const setRequestStatus = async (status) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BackendURL}/request/send/${status}/${user._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || "Request failed");
    }
  };

  const handleDrag = () => {
    const xVal = x.get();
    if (xVal > 100) requestRef.current.textContent = "Interested";
    else if (xVal < -100) requestRef.current.textContent = "Ignore";
    else requestRef.current.textContent = "Swipe";
  };

  const handleDragEnd = () => {
    if (x.get() > 180) {
      setRequestStatus("interested");
      dispatch(removeRequest(user._id));
    } else if (x.get() < -180) {
      setRequestStatus("ignored");
      dispatch(removeRequest(user._id));
    } else {
      x.set(0);
      y.set(0);
    }
    requestRef.current.textContent = "Swipe";
  };

  return (
    <motion.div
      drag={index === 0 ? "x" : false} // Only top card is draggable
      dragConstraints={{ left: -200, right: 200 }}
      style={{ 
        gridRow: 1, 
        gridColumn: 1, 
        x, 
        y, 
        opacity: combinedOpacity, 
        rotate, 
        zIndex: totalCards - index, 
        pointerEvents: index === 0 ? "auto" : "none" 
      }}
      // --- MODIFIED CSS FOR STACKED LOOK ---
     animate={{
  scale: index === 0 ? 1 : 0.92,

  // 👇 THIS creates left & right peek
  x: index === 0 ? 0 : index % 2 === 0 ? -40 : 40,

  // small vertical stacking
  y: index * -10,

  // slight rotation for realism
  rotate: index === 0 ? 0 : index % 2 === 0 ? -6 : 6,

  // show only few cards
  opacity: index > 4 ? 0 : 1,
}}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      // 'origin-bottom' makes them scale toward the bottom like a real deck
      className="relative cursor-grab active:cursor-grabbing origin-center"
    >
      {/* Index 0 passed here to ensure Card's internal styles don't conflict */}
      <Card user={user} index={0} />
      
      <motion.div style={{ scale: scaleThumbsUp }} className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none z-50">
        <div className="bg-green-500 p-4 rounded-full shadow-2xl text-white border-4 border-white"><FaThumbsUp size={40} /></div>
      </motion.div>
      <motion.div style={{ scale: scaleThumbsDown }} className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none z-50">
        <div className="bg-red-500 p-4 rounded-full shadow-2xl text-white border-4 border-white"><FaThumbsDown size={40} /></div>
      </motion.div>
    </motion.div>
  );
};

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const requestRef = useRef(null);

  const getFeed = async (pageNumber) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BackendURL}/feed?page=${pageNumber}&limit=10`, { withCredentials: true });
      dispatch(addFeed(res?.data?.users));
    } catch (err) { console.log(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { getFeed(page); }, [page]);
  useEffect(() => { if (feed?.length < 3) setPage((p) => p + 1); }, [feed]);

  if (isLoading && feed.length === 0)
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <FaSpinner className="animate-spin text-blue-600 size-10" />
      </div>
    );

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden flex flex-col items-center justify-center">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4">
        {feed && feed.length > 0 ? (
          <>
            <header className="mb-8 mt-10 text-center">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Find Your Next <span className="text-blue-600">Collaborator</span></h1>
            </header>

            {/* CONTAINER: grid stacks cards on top of each other */}
            <div className="relative grid place-items-center w-full h-[460px]">
              {feed.map((user, index) => (
                <MotionCard key={user._id} user={user} index={index} totalCards={feed.length} requestRef={requestRef} />
              ))}
            </div>

            <footer className="mt-12 flex flex-col items-center gap-2">
              <p ref={requestRef} className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 animate-bounce">
                Swipe
              </p>
              <div className="flex gap-8 text-slate-300">
                <div className="flex flex-col items-center gap-1">
                    <div className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-xs">←</div>
                    <span className="text-[8px] font-bold uppercase">Ignore</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-xs">→</div>
                    <span className="text-[8px] font-bold uppercase">Interest</span>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center max-w-sm relative">
               <div className="absolute -top-6 bg-blue-600 text-white p-5 rounded-3xl shadow-xl">
                  <FaCheckCircle size={32} />
               </div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-6">All Caught Up!</h2>
               <p className="text-sm text-slate-500 mt-3 font-medium px-4">There are no more developers in your area.</p>
               <button 
                onClick={() => window.location.reload()} 
                className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg active:scale-95"
               >
                Refresh Dev Feed
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;