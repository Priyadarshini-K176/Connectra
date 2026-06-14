import React from "react";
import SocialLinks from "../components/SocialLinks";

const teamMembers = [
  {
    name: "Priya",
    role: " Web Developer",
    image: "https://img.freepik.com/premium-vector/developer-female-vector-icon-can-be-used-no-code-iconset_717774-150959.jpg",
    description:
      "I’m a begginer full-stack developer skilled in React, Node.js, and MongoDB. I specialize in building scalable web applications with a focus on performance and user experience. I love exploring new technologies and solving real-world problems. ",
  },
];

const Team = () => {
  return (
  <div className="min-h-[calc(100vh-5rem)] px-6 py-12 bg-gray-50">
    
    {/* Heading */}
    <div className="mx-auto max-w-6xl text-center">
      <h2 className="mb-4 text-4xl font-extrabold text-gray-800 tracking-tight">
        Meet Our Team
      </h2>
      <p className="mx-auto max-w-2xl text-gray-500 leading-relaxed">
        The mind behind Connectra – a passionate solo developer , always passionate about learning new technologies 🚀
      </p>
    </div>

    {/* Cards */}
    <div className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-8">
      {teamMembers.map((member, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white p-6 shadow-md border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          
          {/* Image */}
          <div className="flex justify-center">
            <img
              src={member.image}
              alt={member.name}
              className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-md"
            />
          </div>

          {/* Name */}
          <h3 className="mt-5 text-center text-2xl font-semibold text-gray-800">
            {member.name}
          </h3>

          {/* Role */}
          <p className="text-center text-sm font-medium text-indigo-600">
            {member.role}
          </p>

          {/* Description */}
          <p className="mt-3 text-center text-gray-500 leading-relaxed text-sm">
            {member.description}
          </p>

          {/* Socials */}
          <div className="mt-4 flex justify-center">
            <SocialLinks />
          </div>

        </div>
      ))}
    </div>
  </div>
);
}

export default Team;