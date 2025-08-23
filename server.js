const http = require("http");
const aquireSVG = require("./src/helper/aquireSVG");
require("dotenv").config();
const url = require("url");

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const server = http.createServer((req, res) => {
  // CORS headers - allow both production and development origins
  const allowedOrigins = [FRONTEND_URL, BASE_URL];

  const requestOrigin = req.headers.origin;

  if (allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  } else if (process.env.NODE_ENV === "development") {
    // In development, allow any localhost origin
    res.setHeader(
      "Access-Control-Allow-Origin",
      requestOrigin || "http://localhost:5173"
    );
  } else {
    // In production, default to the configured frontend URL
    res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  }

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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Railway URL: ${BASE_URL}`);
  console.log(`📍 Frontend URL: ${FRONTEND_URL}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
