const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DOCUMENT_NAME = "FriendInvitation";
const COLLECTION_NAME = "FriendInvitations";
const friendInvitationSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        date: {
            type: Date,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = {
    invitationModel: mongoose.model(DOCUMENT_NAME, friendInvitationSchema),
};
