const User = require('../models/users')
const FriendInvitation = require('../models/friendInvitation')
const Message = require('../models/message')
const Conversation = require('../models/conversation')
const friendUpdates = require('../socketHandle/update/friend')
const conversationUpdate = require('../socketHandle/update/conversation')
const userUpdate = require('../socketHandle/update/user')

const friendInvitation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body

        const invitationExist = await FriendInvitation.findOne({
            senderId: senderId,
            receiverId: receiverId
        })

        if (invitationExist) {
            return res.status(406).send("Bạn đã gửi lời mời kết bạn trước đó")
        }
        await FriendInvitation.create({
            senderId: senderId,
            receiverId: receiverId,
            date: new Date()
        })
        friendUpdates.updateFriendPendingInvitation(receiverId.toString())
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
        const invitation = await FriendInvitation.findByIdAndDelete(invitationId)
        const { senderId, receiverId } = invitation
        const senderUser = await User.findById(senderId.toString())
        const receiverUser = await User.findById(receiverId.toString())
        senderUser.friends.push(receiverId)
        receiverUser.friends.push(senderId)
        await senderUser.save()
        await receiverUser.save()

        let conversation = await Conversation.findOne({
            $or: [
                { participants: [senderId, receiverId] },
                { participants: [receiverId, senderId] }
            ]
        })
        if (conversation && conversation.participants.length == 2) {
            const newMessage = await Message.create({
                sender: senderId,
                conversation: conversation._id,
                type: 'accept_friend',
                date: new Date(),
                status: '2'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            })

            conversation.messages.push(newMessage._id)
            await conversation.save()
        } else {
            const firstConversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [],
                date: new Date()
            })
            const firstMessage = await Message.create({
                sender: senderId,
                type: 'accept_friend',
                date: new Date(),
                status: '2'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            })
            firstConversation.messages.push(firstMessage._id)
            firstConversation.save()
        }
        friendUpdates.updateFriendPendingInvitation(receiverId.toString())
        friendUpdates.updateListFriends(receiverId.toString())
        friendUpdates.updateListFriends(senderId.toString())

        // update usedetails
        userUpdate.updateFriendsInUserDetails(senderId.toString())
        userUpdate.updateFriendsInUserDetails(receiverId.toString())

        // update conversation
        conversationUpdate.updateConversation(senderId.toString())
        conversationUpdate.updateConversation(receiverId.toString())
        return res.status(200).send('success')
    } catch (err) {
        return res.status(500).send('Đã xảy ra lỗi vui lòng thử lại')
    }
}

const findFriend = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.json({
                err: true,
                mes: "Email chưa đăng kí tài khoản"
            })
        } else {
            user.password = ''
            return res.json(user)
        }

    } catch (err) {
        console.log(err, 'friend invitation update')
        return res.status(500).send("Đã có lỗi xảy ra. Vui lòng thử lại")
    }
}
const deleteFriend = async (req, res) => {
    try {
        let { userId, friendId } = req.body
        let user = await User.findById(userId)
        let newfriends = user.friends.filter(id => {
            return id != friendId
        })
        user.friends = newfriends
        await user.save()

        let friend = await User.findById(friendId)
        let newfriends2 = friend.friends.filter(id => {
            return id != userId
        })
        friend.friends = newfriends2
        await friend.save()

        // update listfriend
        userUpdate.updateFriendsInUserDetailsUseListFriendParameter(userId, newfriends)
        userUpdate.updateFriendsInUserDetailsUseListFriendParameter(friendId, newfriends2)
        friendUpdates.updateListFriends(userId)
        friendUpdates.updateListFriends(friendId)

        return res.status(200).send('Xóa bạn thành công')
    } catch (err) {
        console.log(err, 'delete Friend')
        res.json({
            errCode: true,
            mes: 'Lỗi server vui lòng thử lại.'
        })
    }
}
module.exports = {
    friendInvitation, rejectInvitation, acceptInvitation, findFriend,
    deleteFriend
}