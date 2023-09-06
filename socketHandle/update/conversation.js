const Conversation = require('../../models/conversation')
const socketStore = require('../../socketStore')

const updateConversation = async (userId) => {
    try {
        let check = socketStore.checkUserOnline(userId)
        if (check) {
            const conversations = await Conversation.find({
                participants: userId
            }).populate('messages').populate('participants', 'firstName lastName avatar _id')
            const socketId = socketStore.getSocketIdFromUserId(userId)
            const io = socketStore.getInstantSocket()
            io.to(socketId).emit('update-conversation', { conversations })
        }
    } catch (err) {
        console.log(err, 'updateConversation')
    }
}

const updateWatchedMessageStatusInReduxStore = (senderId, receiverId, conversationId) => {
    let check = socketStore.checkUserOnline(senderId)
    if (check) {
        const socketId = socketStore.getSocketIdFromUserId(senderId)
        const io = socketStore.getInstantSocket()
        io.to(socketId).emit('update-watched-status-message-in-redux-store', { senderId, receiverId, conversationId })
    }
}
const updateSentMessageStatusInReduxStore = (senderId, receiverId, conversationId) => {
    let check = socketStore.checkUserOnline(senderId)
    if (check) {
        const socketId = socketStore.getSocketIdFromUserId(senderId)
        const io = socketStore.getInstantSocket()
        io.to(socketId).emit('update-sent-status-message-in-redux-store', { senderId, receiverId, conversationId })
    }
}

const updateReceivedMessageStatusInReduxStore = (senderId, receiverId, conversationId) => {
    let check = socketStore.checkUserOnline(senderId)
    if (check) {
        const socketId = socketStore.getSocketIdFromUserId(senderId)
        const io = socketStore.getInstantSocket()
        io.to(socketId).emit('update-received-status-message-in-redux-store', { senderId, receiverId, conversationId })
    }
}

module.exports = {
    updateConversation, updateWatchedMessageStatusInReduxStore,
    updateSentMessageStatusInReduxStore, updateReceivedMessageStatusInReduxStore
}