const http = require("http");
const aquireSVG = require("./src/helper/aquireSVG");
require("dotenv").config();
const url = require("url");

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const server = http.createServer((req, res) => {
  // CORS headers - allow both production and development origins
  const allowedOrigins =
    process.env.NODE_ENV === "production" ? FRONTEND_URL : BASE_URL;

  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);

  // Handle root path with authentication
  if (req.method === "GET" && parsedUrl.pathname === "/") {
    const providedKey = parsedUrl.query.key;

    // Add strict validation
    if (!providedKey) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Authentication failed - No key provided");
      return;
    }

    if (providedKey === process.env.QUERRY_TOKEN) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Welcome, admin!");
    } else {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Authentication failed - Invalid key");
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
  console.log(`🚀 Server running on ${process.env.NODE_ENV}`);
  console.log(`📍 Development-Local: http://localhost:${PORT}`);
  console.log(`📍 Production-Frontend URL: ${FRONTEND_URL}`);
});
