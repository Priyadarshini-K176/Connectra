const crypto = require("crypto");

const getSecretRoomId = (loggedInUsername, userId) => {
    console.log([loggedInUsername, userId].sort());
    return crypto
        .createHash("sha256")
        .update([loggedInUsername, userId].sort().join("_"))
        .digest("hex");
};


const SKILLS_LIST = [
    "Angular",
    "Android Development",
    "AWS",
    "Amazon Web Services",
    "Apache",
    "API Design",
    "App Development",
    "ASP.NET",
    "Assembly Language",
    "Artificial Intelligence",
    "Azure",
    "Agile",
    "Agile Methodology",
    "Ansible",
    "AWS Lambda",
    "Automation",
    "Apache Kafka",
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "MongoDB",
    "Express",
    "TypeScript",
];

module.exports = { getSecretRoomId, SKILLS_LIST };