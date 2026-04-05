import { FaStar, FaStarHalf } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const user = useSelector((store) => store.user);

return (
  <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 text-center overflow-hidden">

    {/* Content */}
    <div className="relative z-10 max-w-3xl">

      <h1 className="mb-4 text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl tracking-tight">
        Connec<span className="text-primary">tra</span><span className="text-accent1">.</span>
      </h1>

      <h2 className="mb-4 text-lg font-semibold text-gray-700 sm:text-xl md:text-2xl">
        <span className="text-primary">Swipe.</span> <span className="text-accent1">Match.</span> Build together.
      </h2>

      <p className="mx-auto mb-10 max-w-lg text-sm leading-relaxed text-gray-500 sm:text-base">
        Connect with <span className="text-gray-800 font-medium">talented developers</span> who share your goals, skills, and ambition — not just static profiles.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to={user ? "/feed" : "/signup"}>
          <button className="w-full sm:w-auto rounded-full bg-gray-900 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-black hover:shadow-xl active:scale-95">
            {user ? "Explore Feed" : "Get Started"}
          </button>
        </Link>

        <button className="w-full sm:w-auto rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
          Learn More
        </button>
      </div>

    </div>

    {/* Floating avatars strip */}
    <div className="absolute bottom-10 flex flex-col items-center gap-4">
      <div className="flex -space-x-3">
        {[
          "https://randomuser.me/api/portraits/men/32.jpg",
          "https://randomuser.me/api/portraits/women/44.jpg",
          "https://randomuser.me/api/portraits/men/75.jpg",
          "https://randomuser.me/api/portraits/women/68.jpg",
          "https://randomuser.me/api/portraits/men/90.jpg",
        ].map((img, i) => (
          <img
            key={i}
            src={img}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md ring-1 ring-gray-100"
          />
        ))}
      </div>

      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
        Joined by <span className="text-primary font-bold">1,500+</span> developers
      </p>
    </div>

  </section>
);
};

export default HeroSection;