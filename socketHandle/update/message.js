const Message = require('../../models/message')
const conversation = require('../update/conversation')
const socketStore = require('../../socketStore')

const updateWatchedMessageStatus = async (listMessage, conversationId) => {
    try {
        listMessage.forEach(async (mes) => {
            let mesDb = await Message.findById(mes._id)
            mesDb.status = '3'
            mesDb.save()
        });
        conversation.updateWatchedMessageStatusInReduxStore(listMessage, conversationId)
    } catch (err) {
        console.log(err, 'updateWatchedMessageStatus')
    }
}

const updateReceivedMessageStatus = async (listMessage, conversationId) => {
    try {
        listMessage.forEach(async (mes) => {
            let mesDb = await Message.findById(mes._id)
            mesDb.status = '2'
            mesDb.save()
        });
        conversation.updateReceivedMessageStatusInReduxStore(listMessage, conversationId)
    } catch (err) {
        console.log(err, 'updateReceivedMessageStatus')
    }
}

const sendOneMessage = async (messageId, receiverId) => {
    try {
        let check = socketStore.checkUserOnline(receiverId)
        if (check) {
            let message = await Message.findById(messageId)
                .populate({
                    path: 'sender',
                    select: '_id'
                })
                .populate({
                    path: 'conversation',
                    select: '_id'
                })
            const socketId = socketStore.getSocketIdFromUserId(receiverId)
            const io = socketStore.getInstantSocket()
            io.to(socketId).emit('sendOneMessage', { message: message })
        }
    } catch (err) {
        console.log(err, 'updateConversation')
    }
}
module.exports = {
    updateWatchedMessageStatus, updateReceivedMessageStatus, sendOneMessage
}