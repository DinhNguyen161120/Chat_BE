
const socketStore = require('../../socketStore')
const userModel = require('../../models/users')

const updateFriendsInUserDetails = async (userId) => {
    try {
        let socketId = socketStore.getSocketIdFromUserId(userId)
        let io = socketStore.getInstantSocket()
        let user = await userModel.findById(userId)
        io.to(socketId).emit('update-friends-user-details', { friends: user.friends })
    } catch (e) {
        console.log(e)
    }
}
const updateFriendsInUserDetailsUseListFriendParameter = async (userId, listFriends) => {
    try {
        let socketId = socketStore.getSocketIdFromUserId(userId)
        let io = socketStore.getInstantSocket()
        io.to(socketId).emit('update-friends-user-details', { friends: listFriends })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    updateFriendsInUserDetails,
    updateFriendsInUserDetailsUseListFriendParameter
}