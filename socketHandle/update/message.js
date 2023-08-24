
const Message = require('../../models/message')
const conversation = require('../update/conversation')

const updateWatchedMessageStatus = async (senderId, receiverId, conversationId) => {
    try {
        await Message.updateMany({ receiverId, senderId, status: 2 }, { status: 3 })
        conversation.updateWatchedMessageStatusInReduxStore(senderId, receiverId, conversationId)
    } catch (err) {
        console.log(err, 'updateWatchedMessageStatus')
    }
}
const updateReceivedMessageStatus = async (senderId, receiverId, conversationId) => {
    try {
        await Message.updateMany({ receiverId, senderId, status: 1 }, { status: 2 })
        conversation.updateReceivedMessageStatusInReduxStore(senderId, receiverId, conversationId)
    } catch (err) {
        console.log(err, 'updateReceivedMessageStatus')
    }
}

module.exports = {
    updateWatchedMessageStatus, updateReceivedMessageStatus
}