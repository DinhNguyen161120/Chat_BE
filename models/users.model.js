const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";
const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        role: { type: String, required: true, enum: ["User", "Admin"], default: "User" },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: { type: String, required: true, enum: ["active", "inactive"], default: "active" },
        avatar: { type: String, default: "" },
        gender: { type: String, default: "" },
        birthday: { type: Date, default: Date.now() },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = {
    userModel: mongoose.model(DOCUMENT_NAME, userSchema),
};
