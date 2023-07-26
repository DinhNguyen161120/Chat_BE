

const socketStore = require('../../socketStore')
const FriendInvitation = require('../../models/friendInvitation')

const updateFriendPendingInvitation = async (userId) => {
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
}

module.exports = {
    updateFriendPendingInvitation
}