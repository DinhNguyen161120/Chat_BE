const Message = require('../../models/message')
const conversation = require('../update/conversation')

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

module.exports = {
    updateWatchedMessageStatus, updateReceivedMessageStatus
}