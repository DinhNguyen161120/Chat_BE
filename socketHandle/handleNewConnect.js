
const socketStore = require('../socketStore')

const handleNewConnected = (socket, userDetails) => {
    socketStore.addNewConnectedUser(socket.id, userDetails._id)
}

module.exports = handleNewConnected;