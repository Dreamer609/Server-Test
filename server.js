const http = require("http");
const aquireSVG = require("./src/helper/aquireSVG");
require("dotenv").config();
const url = require("url");


const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const server = http.createServer((req, res) => {
  // CORS headers - allow configured frontend or all in development
  const allowedOrigin =
    process.env.NODE_ENV === "production" ? BASE_URL : FRONTEND_URL;

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);

  // Handle root path with authentication
  if (req.method === "GET" && parsedUrl.pathname === "/") {
    if (process.env.QUERRY_TOKEN === parsedUrl.query.key) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Welcome, admin!");
    } else {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Authentication failed");
    }
    return;
  }

  // Handle SVG acquisition
  if (req.method === "GET" && parsedUrl.pathname === "/resource/acquireSVG") {
    aquireSVG(req, res);
    return;
  }

  // Fallback for any other route
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

// Use the proper PORT from environment variables
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  if (BASE_URL !== `http://localhost:${PORT}`) {
    console.log(`📍 External: ${BASE_URL}`);
  }
});
