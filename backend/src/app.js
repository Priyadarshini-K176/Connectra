// src/app.js

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://connectra-rose.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/userConnection"));
app.use("/", require("./routes/search"));
app.use("/", require("./routes/payment"));
app.use("/", require("./routes/chat"));
app.use("/", require("./routes/skills"));
app.use("/", require("./routes/recommendation"));

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

module.exports = app;