const express = require("express");

const router = express.Router();
const ConversationController = require("../../controllers/conversationController");
const asyncHandler = require("../../helpers/asyncHandler");

router.post("/with-message", asyncHandler(ConversationController.createNewConversation));
router.post(
    "/without-message",
    asyncHandler(ConversationController.createNewConversationWithoutMessage),
);
router.post("/group", asyncHandler(ConversationController.createGroup));
router.delete("/", asyncHandler(ConversationController.deleteConversation));

module.exports = router;
