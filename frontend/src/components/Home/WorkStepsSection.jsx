const WorkStepsSection = () => {
  const steps = [
    {
      title: "Create Your Profile",
      description: "Showcase your skills, experience, and interests in one place.",
      point: "Build your presence",
    },
    {
      title: "Connect with Developers",
      description: "Discover and connect with developers who match your goals.",
      point: "Grow your network",
    },
    {
      title: "Collaborate & Grow",
      description: "Work on projects, share ideas, and improve together.",
      point: "Level up faster",
    },
  ];

  return (
    <section className="bg-blue-50 p-10 rounded-xl border border-blue-100" id="support">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          How Connectra Works
        </h2>
        <p className="text-slate-500 mt-2 text-sm font-medium">
          Connect, collaborate, and grow in three simple steps
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-white p-8 border border-blue-100 rounded-lg relative"
          >
            {/* Step Number Badge */}
            <div className="absolute -top-3 -left-3 bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm shadow-sm">
              {i + 1}
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {step.title}
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {step.description}
            </p>

            <div className="pt-3 border-t border-blue-50">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                {step.point}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkStepsSection;