
const connectedUsers = new Map()
let io = null

const setInstantSocket = (ioInstant) => {
    io = ioInstant
}

const getInstantSocket = () => {
    return io
}

const addNewConnectedUser = (socketId, userId) => {
    console.log('add new connected user')
    connectedUsers.set(socketId, userId)
    console.log(connectedUsers)
}

const removeConnect = (socketId) => {
    connectedUsers.delete(socketId)
    console.log(connectedUsers)
    console.log('delete connected user')
}


module.exports = {
    setInstantSocket,
    addNewConnectedUser,
    getInstantSocket,
    removeConnect
}