const Conversation = require('../../models/conversation')
const socketStore = require('../../socketStore')

const updateConversation = async (userId) => {
    try {
        let check = socketStore.checkUserOnline(userId)
        if (check) {
            const conversations = await Conversation.find({
                participants: userId
            })
                .populate('participants', 'firstName lastName avatar _id')
                .populate('messages')
                .populate({
                    path: 'messages',
                    populate: {
                        path: 'sender',
                        select: '_id avatar firstName lastName'
                    }
                })
                .populate({
                    path: 'messages',
                    populate: {
                        path: 'conversation',
                        select: '_id'
                    }
                })
            const socketId = socketStore.getSocketIdFromUserId(userId)
            const io = socketStore.getInstantSocket()
            io.to(socketId).emit('update-conversation', { conversations })
        }
    } catch (err) {
        console.log(err, 'updateConversation')
    }
}

const updateWatchedMessageStatusInReduxStore = (listMessage, conversationId) => {
    try {
        let senderId = listMessage[0].sender._id
        let check = socketStore.checkUserOnline(senderId)
        if (check) {
            const socketId = socketStore.getSocketIdFromUserId(senderId)
            const io = socketStore.getInstantSocket()
            io.to(socketId).emit('update-watched-status-message-in-redux-store', { listMessage, conversationId })
        }
    } catch (e) {
        console.log(e)
    }
}
const updateSentMessageStatusInReduxStore = (listMessage, conversationId) => {
    try {
        let senderId = listMessage[0].sender._id
        let check = socketStore.checkUserOnline(senderId)
        if (check) {
            const socketId = socketStore.getSocketIdFromUserId(senderId)
            const io = socketStore.getInstantSocket()
            io.to(socketId).emit('update-sent-status-message-in-redux-store', { listMessage, conversationId })
        }
    } catch (e) {
        console.log(e)
    }
}

const updateReceivedMessageStatusInReduxStore = (listMessage, conversationId) => {
    try {
        let senderId = listMessage[0].sender._id
        let check = socketStore.checkUserOnline(senderId)
        if (check) {
            const socketId = socketStore.getSocketIdFromUserId(senderId)
            const io = socketStore.getInstantSocket()
            io.to(socketId).emit('update-received-status-message-in-redux-store', { listMessage, conversationId })
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    updateConversation, updateWatchedMessageStatusInReduxStore,
    updateSentMessageStatusInReduxStore, updateReceivedMessageStatusInReduxStore
}