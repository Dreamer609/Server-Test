const http = require("http");
const aquireSVG = require("./src/helper/aquireSVG");
require("dotenv").config();
const url = require("url");

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (
    req.method === "GET" &&
    parsedUrl.pathname === "/" &&
    process.env.QUERRY_AUTH_TOKEN === parsedUrl.query.QUERRY_AUTH_TOKEN
  ) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome, admin!");
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname === "/resource/acquireSVG") {
    aquireSVG(req, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

// Bind to all network interfaces (required on Railway)
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at ${PORT}`);
});
