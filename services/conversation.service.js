"use strict";
const { updateConversation } = require("../socketHandle/update/conversation");
const { messageModel } = require("../models/message.model");
const { conversationModel } = require("../models/conversation.model");
const socketStore = require("../socketStore");

class ConversationService {
    static createNewConversation = async ({ sender, receiverId, content, type, date }) => {
        let status = 1;

        let check = socketStore.checkUserOnline(receiverId);
        if (check) {
            status = 2;
        }

        let newConversation = await conversationModel.create({
            participants: [sender._id, receiverId],
            messages: [],
            date: new Date(),
        });

        let newMessage = await messageModel.create({
            sender,
            content,
            conversation: newConversation._id,
            type,
            date,
            status,
        });
        newConversation.messages.push(newMessage._id);
        await newConversation.save();

        updateConversation(sender._id);
        updateConversation(receiverId);

        return {
            message: "Create conversation success",
            code: "conversation_0",
            conversation: newConversation,
        };
    };
    static createNewConversationWithoutMessage = async ({ senderId, receiverId }) => {
        let newConversation = await conversationModel.create({
            participants: [senderId, receiverId],
            messages: [],
            date: new Date(),
        });
        // conversationUpdate.updateConversation(senderId)
        return {
            message: "Create conversation without message success!",
            code: "conversation_1",
            conversation: newConversation,
        };
    };
    static deleteConversation = async ({ conversationId }) => {
        let conversation = await conversationModel.findByIdAndDelete(conversationId);
        let participants = conversation.participants;

        participants.forEach((id) => {
            updateConversation(id.toString());
        });

        await messageModel.deleteMany({ conversation: conversation._id });

        return {
            message: "delete successfully",
            code: "delete_0",
        };
    };

    static createGroup = async ({ groupName, participants, leaderId }) => {
        let newConversation = await conversationModel.create({
            participants,
            groupName,
            leader: leaderId,
            date: Date.now(),
        });

        let newMessage = await messageModel.create({
            sender: leaderId,
            content: "",
            conversation: newConversation._id,
            type: "create_group",
            date: Date.now(),
            status: "0",
        });

        newConversation.messages.push(newMessage._id);
        await newConversation.save();

        participants.forEach((id) => {
            updateConversation(id.toString());
        });

        return {
            message: "Create group success",
            code: "create_group_0",
        };
    };
}

module.exports = ConversationService;
