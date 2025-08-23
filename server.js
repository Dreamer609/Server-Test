const http = require("http");
const aquireSVG = require("./src/helper/aquireSVG");
require("dotenv").config();
const url = require("url"); // You need to import url module

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const server = http.createServer((req, res) => {
  // CORS headers - allow both production and development origins
  const allowedOrigin = FRONTEND_URL;

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true); // You need to parse the URL

  // Handle root path with authentication
  if (req.method === "GET" && parsedUrl.pathname === "/") {
    const isAdmin = req.headers["authorization"];

    // Add strict validation
    if (isAdmin) {
      if (isAdmin === process.env.ADMIN_AUTH_TOKEN) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Welcome, admin!");
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Unauthorized user" }));
      }
    } else {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Who are you" }));
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
  console.log(`🚀 Server running on ${BASE_URL}`);
  console.log(`📍 Development-Local: http://localhost:${PORT}`);
  console.log(`📍 Allowed-Origin: ${FRONTEND_URL}`);
});
