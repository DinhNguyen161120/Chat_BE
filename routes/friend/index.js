const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();
const FriendController = require("../../controllers/friendController");

router.use("/reject", asyncHandler(FriendController.rejectFriend));
router.use("/accept", asyncHandler(FriendController.acceptFriend));
router.use("/find", asyncHandler(FriendController.findFriend));
router.use("/invitation", asyncHandler(FriendController.friendInvitation));
router.use("/delete", asyncHandler(FriendController.deleteFriend));

module.exports = router;
