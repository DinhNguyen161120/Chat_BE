const socketStore = require('../../socketStore')
const FriendInvitation = require('../../models/friendInvitation')
const User = require('../../models/users')

const updateFriendPendingInvitation = async (userId) => {
    try {
        const pendingInvitations = await FriendInvitation.find({
            receiverId: userId
        }).populate('senderId', 'email firstName lastName _id avatar')
        const io = socketStore.getInstantSocket()
        const activeConnections = socketStore.getActiveConnections(userId)
        activeConnections.forEach((receiverId) => {
            io.to(receiverId).emit('update-friend-invitation', {
                pendingInvitations: pendingInvitations ? pendingInvitations : []
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const updateListFriends = async (userId) => {
    try {
        const user = await User.findById(userId).populate('friends', 'email firstName lastName _id avatar birthday sex')
        if (user) {
            const listFriends = user.friends
            const socketId = socketStore.getSocketIdFromUserId(userId)
            const io = socketStore.getInstantSocket()
            io.to(socketId).emit('update-list-friend', {
                listFriends: listFriends ? listFriends : []
            })
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    updateFriendPendingInvitation, updateListFriends
}