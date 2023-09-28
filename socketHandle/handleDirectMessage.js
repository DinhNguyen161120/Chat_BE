const Message = require('../models/message')
const Conversation = require('../models/conversation')
const conversationUpdate = require('../socketHandle/update/conversation')
const socketStore = require('../socketStore')
const updateStatusMessage = require('./update/conversation')

const handleDirectMessage = async (messageData) => {
    try {
        let { senderId, receiverId, content, type, date, status } = messageData
        status = 1
        // cap nhat trang thai message dua tren hoat dong cua user
        let check = socketStore.checkUserOnline(receiverId)
        if (check) {
            status = 2
        }

        let message = await Message.create({
            senderId,
            receiverId,
            content,
            type,
            date,
            status
        })

        let conversation = await Conversation.findOne({
            $or: [
                { participants: [senderId, receiverId] },
                { participants: [receiverId, senderId] }
            ]
        })
        let conversationId = ''
        if (conversation) {
            conversationId = conversation._id
            conversation.messages.push(message._id)
            await conversation.save()
        } else {
            let newConversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [message._id],
                date: new Date()
            })
            conversationId = newConversation._id
        }
        if (status === 1) {
            updateStatusMessage.updateSentMessageStatusInReduxStore(senderId, receiverId, conversationId)
        } else if (status === 2) {
            updateStatusMessage.updateReceivedMessageStatusInReduxStore(senderId, receiverId, conversationId)
        }
        conversationUpdate.updateConversation(receiverId)
    } catch (err) {
        console.log(err, 'sockethandle/update/message.js')
    }
}

module.exports = {
    handleDirectMessage
}