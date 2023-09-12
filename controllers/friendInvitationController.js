const User = require('../models/users')
const FriendInvitation = require('../models/friendInvitation')
const Message = require('../models/message')
const Conversation = require('../models/conversation')
const friendUpdates = require('../socketHandle/update/friend')
const conversationUpdate = require('../socketHandle/update/conversation')

const friendInvitation = async (req, res) => {
    try {
        const { email, senderId, senderEmail } = req.body
        if (email === senderEmail) {
            return res.status(406).send("Email này là của bạn ")
        }
        const receiverUser = await User.findOne({ email: email })
        if (!receiverUser) {
            return res.status(406).send("Email chưa đăng kí tài khoản")
        }
        const invitationExist = await FriendInvitation.findOne({
            senderId: senderId,
            receiverId: receiverUser._id
        })
        if (invitationExist) {
            return res.status(406).send("Bạn đã gửi lời mời kết bạn trước đó")
        }
        await FriendInvitation.create({
            senderId: senderId,
            receiverId: receiverUser._id,
            date: new Date()
        })
        friendUpdates.updateFriendPendingInvitation(receiverUser._id.toString())
        return res.status(200).send('Gửi lời mời kết bạn thành công')
    } catch (err) {
        console.log(err, 'friend invitation update')
        return res.status(500).send("Đã có lỗi xảy ra. Vui lòng thử lại")
    }
}

const rejectInvitation = async (req, res) => {
    try {
        const invitationId = req.body._id
        const receiverId = req.body.receiverId
        await FriendInvitation.findByIdAndDelete(invitationId)
        friendUpdates.updateFriendPendingInvitation(receiverId.toString())
        return res.status(200).send('success')
    } catch (err) {
        return res.status(500).send('Đã xảy ra lỗi vui lòng thử lại')
    }
}

const acceptInvitation = async (req, res) => {
    try {
        const { invitationId } = req.body
        const invitation = await FriendInvitation.findById(invitationId)
        const { senderId, receiverId } = invitation
        const senderUser = await User.findById(senderId.toString())
        const receiverUser = await User.findById(receiverId.toString())
        senderUser.friends.push(receiverId)
        receiverUser.friends.push(senderId)
        await senderUser.save()
        await receiverUser.save()
        await FriendInvitation.findByIdAndDelete(invitationId)
        friendUpdates.updateFriendPendingInvitation(receiverId.toString())
        friendUpdates.updateListFriends(receiverId.toString())
        friendUpdates.updateListFriends(senderId.toString())

        const firstMessage = await Message.create({
            senderId: senderId,
            receiverId: receiverId,
            isAnnounceFromServer: true,
            typeAnnounce: 'acceptFriend',
            date: new Date(),
            status: 2     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
        })

        const firstConversation = await Conversation.create({
            participants: [senderId, receiverId],
            messages: [firstMessage._id],
            date: new Date()
        })

        // update conversation
        conversationUpdate.updateConversation(senderId.toString())
        conversationUpdate.updateConversation(receiverId.toString())
        return res.status(200).send('success')
    } catch (err) {
        return res.status(500).send('Đã xảy ra lỗi vui lòng thử lại')
    }
}

module.exports = {
    friendInvitation, rejectInvitation, acceptInvitation
}