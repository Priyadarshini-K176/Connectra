const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Please login first",
      });
    }

   const decoded = jwt.verify(token, process.env.secretJWT || "fallback_secret_for_testing");

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("🔥 AUTH ERROR FULL:", err);

    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};

module.exports = { userAuth };