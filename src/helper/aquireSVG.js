const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "src/assets", "assets.json");

const aquireSVG = (req, res) => {
  const hasAUTH = req.headers["authorization"];
  try {
    if (hasAUTH) {
      if (hasAUTH === process.env.RESOURCE_ACCESS_TOKEN) {
        fetchFile(res);
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

const fetchFile = (res) => {
  // Add debug logging to see the actual file path
  console.log("Looking for file at:", filePath.slice(22, filePath.length));

  fs.readFile(filePath, "utf8", (error, data) => {
    if (!error) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    } else {
      console.error("File read error:", error); // error logging
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to load icons" }));
    }
  });
};

module.exports = aquireSVG;
