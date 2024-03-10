"use strict";
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// public api
router.use("/api/v1", require("./access"));

// secret api
router.use("/api/v1/friend", verifyToken, require("./friend"));
router.use("/api/v1/user", verifyToken, require("./user"));
router.use("/api/v1/conversation", verifyToken, require("./conversation"));

module.exports = router;
