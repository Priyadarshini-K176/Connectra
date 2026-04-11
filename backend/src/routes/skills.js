// c:\projects\chat-app\backend\src\routes\skills.js
const express = require("express");
const Fuse = require("fuse.js");

// NOTE: Make sure the path to your skills list is correct relative to this router file!
const { SKILLS_LIST } = require("../utils/constants"); // Adjust this path if needed

const router = express.Router();
const skills = SKILLS_LIST;

const options = {
    includeScore: true,
    threshold: 0.2,
    keys: ["skill"],
};

const fuse = new Fuse(
    skills.map((skill) => ({ skill })),
    options
);

function searchSkills(query) {
    if (!query) return skills;

    const queryLower = query.toLowerCase();

    const exactMatches = skills.filter((skill) =>
        skill.toLowerCase().startsWith(queryLower)
    );

    const results = fuse.search(queryLower);

    const nonExactMatches = results
        .map((result) => result.item.skill)
        .filter((skill) => !exactMatches.includes(skill));

    return [...exactMatches, ...nonExactMatches];
}

function paginateResults(results, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = page * limit;
    return results.slice(start, end);
}

// Notice it's router.get() instead of app.get()
router.get("/api/skills", (req, res) => {
    try {
        const { query = "", page = 1, limit = 10 } = req.query;

        const filteredSkills = searchSkills(query);

        const paginatedSkills = paginateResults(
            filteredSkills,
            parseInt(page),
            parseInt(limit)
        );

        return res.json({
            success: true,
            message: "Skills fetched",
            query,
            totalResults: filteredSkills.length,
            totalPages: Math.ceil(filteredSkills.length / limit),
            currentPage: parseInt(page),
            skills: paginatedSkills,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || err,
        });
    }
});

module.exports = router;
