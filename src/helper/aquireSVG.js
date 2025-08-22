const aquireSVG = (req, res) => {
  const hasAUTH = req.headers["authorization"];
  try {
    if (hasAUTH) {
      if (hasAUTH === process.env.AUTH_TOKEN) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello acquiring svg");
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

module.exports = aquireSVG;
