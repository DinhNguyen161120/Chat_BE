
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

const checkUserOnline = (userId) => {
    let check = false
    connectedUsers.forEach((value, key) => {
        if (value === userId) {
            check = true
        }
    })
    return check
}

const getActiveConnections = (userId) => {
    const activeConnections = []
    connectedUsers.forEach((value, key) => {
        if (value === userId)
            activeConnections.push(key)
    })
    return activeConnections
}

const getSocketIdFromUserId = (userId) => {
    let activeConnections = ''
    connectedUsers.forEach((value, key) => {
        if (value === userId)
            activeConnections = key
    })
    return activeConnections
}


module.exports = {
    setInstantSocket,
    addNewConnectedUser,
    getInstantSocket,
    removeConnect,
    checkUserOnline,
    getActiveConnections,
    getSocketIdFromUserId
}