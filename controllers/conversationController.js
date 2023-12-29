const { SuccessResponse } = require("../core/success.response");
const ConversationService = require("../services/conversation.service");

class ConversationController {
    createNewConversation = async (req, res, next) => {
        new SuccessResponse({
            message: "Create conversation success!",
            metadata: await ConversationService.createNewConversation(req.body),
        }).send(res);
    };
    createNewConversationWithoutMessage = async (req, res, next) => {
        new SuccessResponse({
            message: "Create conversation without message success!",
            metadata: await ConversationService.createNewConversationWithoutMessage(req.body),
        }).send(res);
    };
    deleteConversation = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete conversation success!",
            metadata: await ConversationService.deleteConversation(req.body),
        }).send(res);
    };
    createGroup = async (req, res, next) => {
        new SuccessResponse({
            message: "Create group conversation success!",
            metadata: await ConversationService.createGroup(req.body),
        }).send(res);
    };
}

module.exports = new ConversationController();
