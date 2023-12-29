const socketStore = require("../socketStore");
const { updatePendingInvitation } = require("../socketHandle/update/friend");

const handleNewConnected = (socket, userDetails) => {
    try {
        socketStore.addNewConnectedUser(socket.id, userDetails._id);
        updatePendingInvitation(userDetails._id);
    } catch (e) {
        console.log(e);
    }
};

module.exports = handleNewConnected;
