
const Conversation = require('../../models/conversation')
const socketStore = require('../../socketStore')

const updateConversation = async (userId) => {
    try {
        const conversations = await Conversation.find({
            participants: userId
        }).populate('messages').populate('participants', 'firstName lastName avatar _id')
        const socketId = socketStore.getSocketIdFromUserId(userId)
        const io = socketStore.getInstantSocket()
        io.to(socketId).emit('update-conversation', { conversations })
    } catch (err) {
        console.log(err, 'updateConversation')
    }
}

module.exports = {
    updateConversation
}