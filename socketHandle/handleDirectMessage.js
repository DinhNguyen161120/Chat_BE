const Message = require('../models/message')
const Conversation = require('../models/conversation')
const conversationUpdate = require('../socketHandle/update/conversation')
const socketStore = require('../socketStore')
const updateStatusMessage = require('./update/conversation')
const messageUpdate = require('../socketHandle/update/message')

const handleDirectMessage = async (messageData) => {
    try {
        let { sender, receiverId, conversation, content, type, date, status } = messageData
        status = '1'
        // cap nhat trang thai message dua tren hoat dong cua user
        let check = socketStore.checkUserOnline(receiverId)
        if (check) {
            status = '2'
        }

        let conversationCurrent = await Conversation.findOne({ _id: conversation._id })
        let listMessage = []
        let conversationId = ''
        let messageId = ''
        if (conversationCurrent) {
            let message = await Message.create({
                sender: sender._id,
                content,
                conversation: conversation._id,
                type,
                date,
                status
            })
            listMessage.push({
                _id: message._id,
                sender: {
                    _id: sender._id
                },
                date: message.date
            })
            messageId = message._id
            conversationId = conversationCurrent._id
            conversationCurrent.messages.push(message._id)
            await conversationCurrent.save()
            if (conversationCurrent.messages.length == 1) {
                conversationUpdate.updateConversation(receiverId)
            }
        }
        if (status === '1') {
            updateStatusMessage.updateSentMessageStatusInReduxStore(listMessage, conversationId)
        } else if (status === '2') {
            updateStatusMessage.updateReceivedMessageStatusInReduxStore(listMessage, conversationId)
        }
        messageUpdate.sendOneMessage(messageId, receiverId)
    } catch (err) {
        console.log(err, 'sockethandle/update/message.js')
    }
}

module.exports = {
    handleDirectMessage
}