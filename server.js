const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const { slowDown } = require("express-slow-down");
require("dotenv").config();

const PORT = process.env.PORT;

app.use(cors({ origin: "*" }));

app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 10, // every 30 seconds, users can make 10 requests
});

// Speed Limiting
const speedLimit = slowDown({
  windowMs: 30 * 1000,
  delayAfter: 5,
  delayMs: (hits) => hits * 100,
});

// Allow Listing
const allowedIp = ["::1", "::ffff:192.168.1.20"];

const allowList = (req, res, next) => {
  console.log("ALLOWLIST MIDDLEWARE");
  console.log("Incoming address : ", req.ip, req.connection.remoteAddress);
  console.log(
    `::ffff:${req.connection.remoteAddress}`,
    req.connection.remoteAddress
  );
  if (!allowedIp.includes(`${req.connection.remoteAddress}`)) {
    return res.status(403).send({ message: "You are not allowed to access!" });
  }
  next();
};

// Leveled API Keys
const API_KEYS = {
  GET: process.env.READ_ONLY_API_KEY,
  POST: process.env.WRITE_ACCESS_API_KEY,
  PUT: process.env.WRITE_ACCESS_API_KEY,
  DELETE: process.env.WRITE_ACCESS_API_KEY,
};

const leveledApi = (req, res, next) => {
  console.log("LEVELED MIDDLEWARE");
  const { "x-api-key": leveledApiKey } = req.headers;

  if (API_KEYS[req.method] !== leveledApiKey) {
    return res.status(403).send({ message: "Invalid API Key" });
  }

  next();
};

app.all("/secure", leveledApi, (req, res) => {
  console.log("Incoming address : ", req.ip, req.connection.remoteAddress);
  res.send({ message: "THIS API IS SECURE!" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
