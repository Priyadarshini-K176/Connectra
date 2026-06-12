require("dotenv").config();
const express = require("express");
const searchRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

searchRouter.get("/search", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }

    // Safe env var with fallback
    const allowedFieldsStr = process.env.ALLOWED_FIELDS || "username,firstName,lastName,skills,headline,avatar";
    let searchFields = allowedFieldsStr.split(",").map(f => f.trim());

    if (!loggedInUser.isPremium) {
      searchFields = searchFields.filter(field => field !== "email" && field !== "about");
    }

    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.min(Math.max(1, parseInt(req.query.limit)), 50) || 10;

    let result = [];
    let resultCount = 0;

    // 🔹 Step 1: Try Full-Text Search (gracefully fallback if index missing)
    if (query.length > 2) {
      try {
        result = await User.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
          .sort( { score: { $meta: "textScore" } } )
          .select(searchFields)
          .skip((page - 1) * limit)
          .limit(limit);

        resultCount = await User.countDocuments({ $text: { $search: query } });
      } catch (textSearchError) {
        // Text index might not exist yet; fall through to regex
        console.warn("Text search failed, falling back to regex:", textSearchError.message);
      }
    }

    // 🔹 Step 2: Fallback to Regex if No Text Results or Text Search Failed
    if (result.length === 0) {
      const regexQuery = {
        $or: [
          { username: { $regex: query, $options: "i" } },
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { skills: { $regex: query, $options: "i" } },
          { headline: { $regex: query, $options: "i" } },
          { about: { $regex: query, $options: "i" } },
        ],
      };

      result = await User.find(regexQuery)
        .select(searchFields)
        .skip((page - 1) * limit)
        .limit(limit);

      resultCount = await User.countDocuments(regexQuery);
    }

    res.status(200).json({
      success: true,
      message: "Search successful",
      isPremiumUser: loggedInUser.isPremium,
      result,
      pagination: {
        currentPage: Number(page),
        resultCount,
        totalPages: Math.ceil(resultCount / limit),
      },
    });
  } catch (err) {
    console.error("Search route error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = searchRouter;