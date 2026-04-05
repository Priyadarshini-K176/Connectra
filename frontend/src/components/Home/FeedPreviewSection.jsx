/* eslint-disable react/prop-types */
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

// Utility for formatting names
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const USERS = [
  {
    username: "ishaan_codes",
    firstName: "Ishaan",
    lastName: "Malhotra",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&h=400&fit=crop", 
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&fit=crop",
    skills: ["React", "Next.js", "Tailwind", "TypeScript", "Node.js"],
    followers: 342,
    following: 120,
    headline: "Frontend Architect | Crafting immersive web experiences with Next.js ⚡",
  },
  {
    username: "sara_dev",
    firstName: "Sara",
    lastName: "Kapoor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1000&fit=crop",
    skills: ["Docker", "K8s", "AWS", "Terraform", "Go"],
    followers: 890,
    following: 450,
    headline: "DevOps Enthusiast | Cloud Native & Scalability | Automating the world ☁️",
  },
  {
    username: "arjun_py",
    firstName: "Arjun",
    lastName: "Reddy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&fit=crop",
    skills: ["Python", "FastAPI", "Postgres", "Redis"],
    followers: 560,
    following: 310,
    headline: "Backend Developer | API Performance Optimization | AI Research 🧠",
  },
];

const Card = ({ user }) => {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += dir === "l" ? -100 : 100;
  };

  return (
    <div className="group relative flex h-[480px] w-[340px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-blue-400/50 sm:h-[520px] sm:w-[380px] xl:h-[580px] xl:w-[440px]">
      {/* Banner */}
      <div className="h-32 min-h-[128px] w-full overflow-hidden md:h-40 xl:h-44">
        <img src={user.banner} className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" alt="banner" />
      </div>

      {/* Avatar - Absolute Positioned */}
      <div className="absolute left-6 top-20 z-10 size-24 overflow-hidden rounded-2xl border-4 border-white shadow-xl md:top-28 md:size-32 xl:top-32 xl:size-36">
        <img src={user.avatar} className="size-full object-cover" alt="avatar" />
      </div>

      {/* Content Area - Using Padding to respect the Avatar space */}
      <div className="flex flex-1 flex-col p-6 pt-16 md:pt-24 xl:pt-28">
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            {capitalize(user.firstName)} <span className="text-blue-600">{capitalize(user.lastName)}</span>
          </h2>
          <p className="text-sm font-bold text-green-600">@{user.username}</p>
        </div>

        <p className="line-clamp-3 text-sm text-gray-500 md:text-base">
          {user.headline}
        </p>

        {/* Skills Scroller */}
        <div className="mt-4 flex items-center gap-2">
          <MdArrowBack className="shrink-0 cursor-pointer text-gray-400 hover:text-blue-600" onClick={() => scroll("l")} />
          <div ref={scrollRef} className="flex flex-1 gap-2 overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar py-1">
            {user.skills.map((s) => (
              <span key={s} className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                {s}
              </span>
            ))}
          </div>
          <MdArrowForward className="shrink-0 cursor-pointer text-gray-400 hover:text-blue-600" onClick={() => scroll("r")} />
        </div>

        {/* Stats Section - Pushed to bottom */}
        <div className="mt-auto flex gap-8 border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">{user.followers}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">{user.following}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MotionCard = ({ user, index, totalCards, handleSwipe, requestRef }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const iconScaleUp = useTransform(x, [50, 150], [0, 1.2]);
  const iconScaleDown = useTransform(x, [-150, -50], [1.2, 0]);

  const handleDrag = () => {
    const valX = x.get();
    if (valX > 100) requestRef.current.textContent = "Interested";
    else if (valX < -100) requestRef.current.textContent = "Ignore";
    else requestRef.current.textContent = "Swipe";
  };

  const handleDragEnd = (e, info) => {
    if (Math.abs(info.offset.x) > 120) {
      handleSwipe(index);
    } else {
      x.set(0);
    }
    requestRef.current.textContent = "Swipe";
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity, gridRow: 1, gridColumn: 1, zIndex: totalCards - index, pointerEvents: index === 0 ? "auto" : "none" }}
      animate={{ scale: index === 0 ? 1 : 0.95, y: index === 0 ? 0 : 15 }}
      className="relative origin-bottom cursor-grab active:cursor-grabbing"
    >
      <Card user={user} />
      
      {/* Visual Swipe Feedback */}
      <motion.div style={{ scale: iconScaleUp }} className="absolute right-10 top-1/2 z-20 pointer-events-none">
        <FaThumbsUp className="text-6xl text-green-500 drop-shadow-xl" />
      </motion.div>
      <motion.div style={{ scale: iconScaleDown }} className="absolute left-10 top-1/2 z-20 pointer-events-none">
        <FaThumbsDown className="text-6xl text-red-500 drop-shadow-xl" />
      </motion.div>
    </motion.div>
  );
};

const FeedPreviewSection = () => {
  const requestRef = useRef(null);
  const [users, setUsers] = useState(USERS);

  const handleSwipe = (index) => {
    setUsers((prev) => {
      const swiped = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [...rest, swiped]; // Moves to back of stack
    });
  };

  return (
    <section className="bg-gray-50 py-16 px-6" id="feed">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Connect with Developers who <span className="text-blue-600">Matter.</span>
          </h2>
          <p className="mt-3 text-gray-500">Discover talented collaborators with a swipe.</p>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Card Container */}
          <div className="grid place-items-center h-[550px] w-full sm:h-[600px] xl:h-[700px]">
            <AnimatePresence>
              {users.map((user, i) => (
                <MotionCard 
                  key={user.username} 
                  user={user} 
                  index={i} 
                  totalCards={users.length} 
                  handleSwipe={handleSwipe} 
                  requestRef={requestRef}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {/* Swipe Indicator Text */}
          <p ref={requestRef} className="mt-8 text-sm font-black uppercase tracking-[0.4em] text-gray-300">
            Swipe
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeedPreviewSection;