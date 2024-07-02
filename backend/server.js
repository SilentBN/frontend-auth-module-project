const express = require("express");
const cors = require("cors");
const path = require("path");
const starsRouter = require("./stars/router");
const authTokenRouter = require("./auth/tokenRouter");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 9009;

const server = express();

// Create a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all requests
server.use(limiter);

server.use(express.json());

server.use(express.static(path.join(__dirname, "../dist")));

server.use(cors());

server.use("/api/auth", authTokenRouter);

server.use("/api/stars", starsRouter);

server.get("*", limiter, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

server.use((req, res) => {
  res.status(404).json({
    message: `Endpoint [${req.method}] ${req.path} does not exist`,
  });
});

server.use((err, req, res, next) => {
  const message = err.message || "Unknown error happened";
  const status = err.status || 500;
  const reason = err.reason;
  const payload = { message };
  if (reason) payload.reason = reason;
  res.status(status).json(payload);
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
