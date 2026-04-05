// server.js

const http = require("http");
const dotenv = require("dotenv");

const { connectDB } = require("./src/config/database");
const initializeSocket = require("./src/utils/socket");
require("./src/utils/cronjob");

dotenv.config();

const app = require("./src/app");

const server = http.createServer(app);

// ✅ Socket
initializeSocket(server);

const PORT = process.env.PORT || 5000;

// ✅ Start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("DB error:", err));