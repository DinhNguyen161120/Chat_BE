const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DOCUMENT_NAME = "Conversation";
const COLLECTION_NAME = "Conversations";
const conversationSchema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
        messages: [{ type: Schema.Types.ObjectId, ref: "Message", default: [] }],
        date: { type: Date },
        leader: { type: Schema.Types.ObjectId, ref: "User" },
        groupName: { type: String, default: "" },
        avatarGroup: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = {
    conversationModel: mongoose.model(DOCUMENT_NAME, conversationSchema),
};
