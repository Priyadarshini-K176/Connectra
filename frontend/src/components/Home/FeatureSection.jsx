import { FaUser } from "react-icons/fa";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { RiBookShelfFill } from "react-icons/ri";


const FeatureSection = () => {
  const features = [
    {
      icon: FaUser,
      title: "Smart Matches",
      point: "Not random profiles",
      description: "We connect you with developers based on skills, interests, and what you actually want to build.",
    },
    {
      icon: RiBookShelfFill,
      title: "Learn & Share",
      point: "Grow together",
      description: "Exchange ideas, collaborate on projects, and stay updated with what others are building.",
    },
    {
      icon: MdOutlineVerifiedUser,
      title: "Real Developers",
      point: "No fake profiles",
      description: "Every profile is authentic, so you spend time connecting — not filtering through noise.",
    },
  ];

  return (
    <section className="bg-bg px-6 py-24" id="features">
      {/* Heading */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl tracking-tight">
          Built for <span className="text-primary">Meaningful</span> <br className="hidden md:block" /> 
          Developer <span className="text-accent1">Connections</span>
        </h2>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/20" />
        <p className="mt-6 text-base text-textMuted max-w-xl mx-auto">
          Find the right people, build faster, and grow with a network that <span className="text-gray-800 font-medium italic">actually</span> matters.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = feature.icon;

          return (
            <div
              key={i}
              className="relative flex flex-col items-start p-8 rounded-2xl border border-border bg-cardBg transition-all"
            >
              {/* Subtle Step Label or Accent */}
              <div className="absolute top-6 right-8 text-xs font-black text-gray-100 uppercase tracking-tighter select-none dark:text-white/5">
                Feature {i + 1}
              </div>

              {/* Icon with colored background */}
              <div className="mb-6 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                <Icon className="text-2xl" />
              </div>

              {/* Title & Point */}
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-accent1 mt-1">
                  {feature.point}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-textMuted">
                {feature.description}
              </p>

              {/* Bottom Accent Bar */}
              <div className="mt-6 h-1 w-8 rounded-full bg-primary/30" />
            </div>
          );
        })}
      </div>
    </section>
  );
};



export default FeatureSection;