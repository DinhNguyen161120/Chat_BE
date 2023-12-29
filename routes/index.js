"use strict";
const express = require("express");
const router = express.Router();

router.use("/api/v1/friend", require("./friend"));
router.use("/api/v1/user", require("./user"));
router.use("/api/v1/conversation", require("./conversation"));
router.use("/api/v1", require("./access"));

module.exports = router;
