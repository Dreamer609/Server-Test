const http = require("http");
const aquireSVG = require("./src/helper/aquireSVG");
require("dotenv").config();

const PORT = process.env.PORT || 3000; 
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/resource/putSVG") {
    aquireSVG(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// Bind to all network interfaces (required on Railway)
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at ${BASE_URL}/resource/putSVG`);
});
