const socketStore = require("../../socketStore");
const { userModel } = require("../../models/users.model");
const { invitationModel } = require("../../models/friendInvitation.model");

const updateFriendPendingInvitation = async (userId) => {
    try {
        const pendingInvitations = await invitationModel
            .find({
                receiverId: userId,
            })
            .populate("senderId", "email firstName lastName _id avatar");
        const io = socketStore.getInstantSocket();
        const activeConnections = socketStore.getActiveConnections(userId);
        activeConnections.forEach((receiverId) => {
            io.to(receiverId).emit("update-friend-invitation", {
                pendingInvitations: pendingInvitations ? pendingInvitations : [],
            });
        });
    } catch (e) {
        console.log(e);
    }
};

const updatePendingInvitation = async (userId) => {
    try {
        const pendingInvitations = await invitationModel
            .find({
                receiver: userId,
            })
            .populate("sender", "email firstName lastName _id avatar")
            .lean();
        const io = socketStore.getInstantSocket();
        const activeConnections = socketStore.getActiveConnections(userId);
        activeConnections.forEach((receiverId) => {
            io.to(receiverId).emit("update-friend-invitation", {
                pendingInvitations: pendingInvitations ? pendingInvitations : [],
            });
        });
    } catch (e) {
        console.log(e);
    }
};

const updateListFriends = async (userId) => {
    try {
        const user = await userModel
            .findById(userId)
            .populate("friends", "email firstName lastName _id avatar birthday gender")
            .lean();
        if (user) {
            const listFriends = user.friends;
            const socketId = socketStore.getSocketIdFromUserId(userId);
            const io = socketStore.getInstantSocket();
            io.to(socketId).emit("update-list-friend", {
                listFriends: listFriends ? listFriends : [],
            });
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    updateListFriends,
    updatePendingInvitation,
};
