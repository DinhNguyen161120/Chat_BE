
const Message = require('../models/message')
const Conversation = require('../models/conversation')
const conversationUpdate = require('../socketHandle/update/conversation')

const handleDirectMessage = async (messageData) => {
    try {
        const { senderId, receiverId, content, type, date } = messageData
        let message = await Message.create({
            senderId,
            receiverId,
            content,
            type,
            date
        })

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if (conversation) {
            conversation.messages.push(message._id)
            await conversation.save()
        } else {
            await Conversation.create({
                participants: [senderId, receiverId],
                messages: [message._id]
            })
        }
        conversationUpdate.updateConversation(senderId)
        conversationUpdate.updateConversation(receiverId)

    } catch (err) {
        console.log(err, 'sockethandle/update/message.js')
    }
}

module.exports = {
    handleDirectMessage
}