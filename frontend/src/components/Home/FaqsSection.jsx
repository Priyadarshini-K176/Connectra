import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "How does Connectra help me find the right developers?",
    answer:
      "Connectra uses smart matching based on your skills, interests, and activity to connect you with developers who align with your goals.",
  },
  {
    question: "Is Connectra free to use?",
    answer:
      "Yes, Connectra offers a free experience where you can connect, collaborate, and explore opportunities. Additional features may be introduced for advanced use.",
  },
  {
    question: "How can I showcase my work on Connectra?",
    answer:
      "You can build your profile by adding projects, GitHub links, tech stacks, and descriptions so others can easily discover and collaborate with you.",
  },
  {
    question: "Can I collaborate on projects directly through Connectra?",
    answer:
      "Yes, Connectra enables developers to connect, discuss ideas, and collaborate on projects seamlessly within the platform.",
  },
  {
    question: "How does Connectra maintain quality connections?",
    answer:
      "We prioritize meaningful connections by considering user activity, skills, and engagement to ensure relevant and productive matches.",
  },
];

const FaqsSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-blue-50/50 px-6 py-20 rounded-[2.5rem] border border-blue-100" id="faqs">
      <div className="mx-auto max-w-5xl">
        
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
            Everything you need to know about Connectra
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === index 
                ? "border-blue-200 bg-white shadow-xl shadow-blue-100/50" 
                : "border-blue-100 bg-white/80 hover:bg-white hover:border-blue-200"
              }`}
            >
              
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className={`text-sm font-bold tracking-tight transition-colors ${
                  openIndex === index ? "text-blue-600" : "text-slate-700"
                }`}>
                  {faq.question}
                </span>

                <FaChevronDown
                  className={`h-4 w-4 text-blue-400 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 text-sm font-medium leading-relaxed text-slate-500 animate-in fade-in slide-in-from-top-1">
                  <div className="pt-2 border-t border-blue-50">
                    {faq.answer}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FaqsSection;