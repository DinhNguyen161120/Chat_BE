
const socketStore = require('../socketStore')
const friendUpdates = require('../socketHandle/update/friend')

const handleNewConnected = (socket, userDetails) => {
    socketStore.addNewConnectedUser(socket.id, userDetails._id)
    friendUpdates.updateFriendPendingInvitation(userDetails._id)
}

module.exports = handleNewConnected;