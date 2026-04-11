// c:\projects\chat-app\backend\src\routes\recommendation.js
const express = require("express");
const Fuse = require("fuse.js");
const User = require("../models/user"); // Ensure path is correct
const { userAuth } = require("../middlewares/auth");


const recommendationRouter = express.Router();

// 1. YOUR HYBRID SEARCH LOGIC - Adapted for User Objects
function searchUsers(allUsers, query, fuse) {
    if (!query) return allUsers;

    const queryLower = query.toLowerCase();

    // EXACT MATCHES: Check if the user has ANY skill that starts with the query
    const exactMatches = allUsers.filter((user) => {
        if (!user.skills) return false;
        return user.skills.some((skill) =>
            skill.toLowerCase().startsWith(queryLower)
        );
    });

    // FUZZY MATCHES: Let fuse.js find the sloppy/typo matches
    const results = fuse.search(queryLower);

    // DE-DUPLICATION: Remove anyone from the fuzzy list who we already found in Exact Matches
    const exactMatchIds = exactMatches.map((u) => u._id.toString());

    const nonExactMatches = results
        .map((result) => result.item) // extract the User object from the fuse result
        .filter((user) => !exactMatchIds.includes(user._id.toString()));

    // COMBINE AND RETURN
    return [...exactMatches, ...nonExactMatches];
}

// 2. YOUR PAGINATION LOGIC
function paginateResults(results, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = page * limit;
    return results.slice(start, end);
}

// 3. YOUR ROUTER (using your endpoint style)
// 3. YOUR INTELLIGENT ROUTER
recommendationRouter.get("/api/recommendations", userAuth, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // 1. Get YOUR skills. If you have no skills, we can't recommend anyone!
        const mySkills = req.user.skills || [];
        if (mySkills.length === 0) {
            return res.json({ success: true, result: [] });
        }

        // Fetch everyone else from the DB
        const allUsers = await User.find({ _id: { $ne: req.user._id } }).select("-password");

        const fuse = new Fuse(allUsers, {
            includeScore: true,
            threshold: 0.2, // keeping your strict matching
            keys: ["skills"],
        });

        let allRecommendedUsers = [];

        // 2. RUN YOUR EXACT SEARCH LOGIC FOR EACH ONE OF YOUR SKILLS
        for (const skill of mySkills) {
            const matches = searchUsers(allUsers, skill, fuse);
            allRecommendedUsers.push(...matches);
        }

        // 3. Remove Duplicates 
        // (If Bob knows both React AND Node, he will mistakenly get added twice. This filters him to 1)
        const uniqueUsersMap = new Map();
        allRecommendedUsers.forEach(user => {
            uniqueUsersMap.set(user._id.toString(), user);
        });
        const finalUniqueMatches = Array.from(uniqueUsersMap.values());

        // 4. Paginate
        const paginatedUsers = paginateResults(
            finalUniqueMatches,
            parseInt(page),
            parseInt(limit)
        );

        return res.json({
            success: true,
            message: "Fuzzy Recommendations generated automatically!",
            totalResults: finalUniqueMatches.length,
            totalPages: Math.ceil(finalUniqueMatches.length / limit),
            currentPage: parseInt(page),
            result: paginatedUsers,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || err,
        });
    }
});

module.exports = recommendationRouter;
