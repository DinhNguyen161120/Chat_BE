const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const userController = require("../../controllers/userController");
const router = express.Router();

router.patch("/", asyncHandler(userController.updateInformation));

module.exports = router;
