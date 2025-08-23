const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "assets", "assets.json");

const aquireSVG = (req, res) => {
  const hasAUTH = req.headers["authorization"];
  try {
    if (hasAUTH) {
      if (hasAUTH === process.env.AUTH_TOKEN) {
        fetchFile(req, res);
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "authorization failed" }));
      }
    } else {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Unauthorized" }));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Server error" }));
  }
};

const fetchFile = (req, res) => {
  fs.readFile(filePath, "utf8", (error, data) => {
    if (!error) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    } else {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to load icons" }));
    }
  });
};

module.exports = aquireSVG;
