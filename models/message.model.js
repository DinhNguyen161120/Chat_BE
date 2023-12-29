const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DOCUMENT_NAME = "Message";
const COLLECTION_NAME = "Messages";
const messageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
        content: { type: String },
        type: { type: String },
        date: { type: Number },
        status: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = {
    messageModel: mongoose.model(DOCUMENT_NAME, messageSchema),
};
