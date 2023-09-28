const conversationModel = require('../models/conversation')
const messageModel = require('../models/message')
const socketStore = require('../socketStore')
const conversationUpdate = require('../socketHandle/update/conversation')

let createNewConversation = async (req, res) => {
    try {
        let { participants, message } = req.body
        let status = 1
        // cap nhat trang thai message dua tren hoat dong cua user
        let check = socketStore.checkUserOnline(message.receiverId)
        if (check) {
            status = 2
        }

        delete message._id
        let newMessage = await messageModel.create({
            ...message,
            status: status
        })
        let newConversation = await conversationModel.create({
            participants: participants,
            messages: [newMessage._id],
            date: new Date()
        })

        participants.forEach(userId => {
            conversationUpdate.updateConversation(userId)
        })
        return res.status(200).json({
            conversation: newConversation
        })
    } catch (err) {
        console.log(err, 'error conversation controller in func  createNewConversation')
        res.status(500).send('Error server')
    }
}

module.exports = {
    createNewConversation
}