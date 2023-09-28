const socketStore = require('../socketStore')
const friendUpdates = require('../socketHandle/update/friend')

const handleNewConnected = (socket, userDetails) => {
    try {
        socketStore.addNewConnectedUser(socket.id, userDetails._id)
        friendUpdates.updateFriendPendingInvitation(userDetails._id)
    } catch (e) {
        console.log(e)
    }
}

module.exports = handleNewConnected;