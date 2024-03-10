"use strict";
const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const AccessController = require("../../controllers/accessController");

router.post("/register", asyncHandler(AccessController.register));
router.post("/login", asyncHandler(AccessController.login));
router.post("/refresh-token", AccessController.refreshToken);

module.exports = router;
