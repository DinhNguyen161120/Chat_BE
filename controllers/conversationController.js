const conversationModel = require('../models/conversation')
const messageModel = require('../models/message')
const socketStore = require('../socketStore')
const conversationUpdate = require('../socketHandle/update/conversation')

let createNewConversation = async (req, res) => {
    try {
        let { sender, receiverId, content, type, date } = req.body
        let status = 1
        // cap nhat trang thai message dua tren hoat dong cua user
        let check = socketStore.checkUserOnline(receiverId)
        if (check) {
            status = 2
        }

        let newConversation = await conversationModel.create({
            participants: [sender._id, receiverId],
            messages: [],
            date: new Date()
        })

        let newMessage = await messageModel.create({
            sender,
            content,
            conversation: newConversation._id,
            type,
            date,
            status
        })
        newConversation.messages.push(newMessage._id)
        await newConversation.save()

        conversationUpdate.updateConversation(sender._id)
        conversationUpdate.updateConversation(receiverId)

        return res.status(200).json({
            conversation: newConversation
        })
    } catch (err) {
        console.log(err, 'error conversation controller in func  createNewConversation')
        res.status(500).send('Error server')
    }
}
let createConversationWithMessage = async (req, res) => {
    try {
        let { senderId, receiverId } = req.body
        let newConversation = await conversationModel.create({
            participants: [senderId, receiverId],
            messages: [],
            date: new Date()
        })
        // conversationUpdate.updateConversation(senderId)
        res.status(200).json({
            conversation: newConversation
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Error server')
    }

}
const deleteConversation = async (req, res) => {
    try {
        let { conversationId } = req.body
        let conversation = await conversationModel.findByIdAndDelete(conversationId)
        let participants = conversation.participants

        participants.forEach(id => {
            conversationUpdate.updateConversation(id.toString())
        })

        messageModel.deleteMany({ conversation: conversationId.toString() })

        res.status(200).send('delete successfully')
    } catch (err) {
        res.status(500).send('Error server')
    }
}
module.exports = {
    createNewConversation,
    createConversationWithMessage,
    deleteConversation
}