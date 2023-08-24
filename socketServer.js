

const { Server } = require('socket.io')
const authSocket = require('./middleware/authSocket')
const socketStore = require('./socketStore')
const handleNewConnected = require('./socketHandle/handleNewConnect')
const conversationUpdate = require('./socketHandle/update/conversation')
const messageUpdate = require('./socketHandle/handleDirectMessage')
const friendUpdate = require('./socketHandle/update/friend')
const updateMessage = require('./socketHandle/update/message')

const registerSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    io.use((socket, next) => {
        authSocket(socket, next)
    })

    socketStore.setInstantSocket(io)

    io.on('connection', (socket) => {
        const userDetails = socket.handshake.auth?.userDetails
        handleNewConnected(socket, userDetails)

        conversationUpdate.updateConversation(userDetails._id)
        friendUpdate.updateListFriends(userDetails._id)
        let activeConnections = socketStore.getAllActiveConnections()
        socket.emit('all-active-user', { activeUsers: activeConnections })

        socket.on('disconnect', () => {
            console.log('disconnect')
            socketStore.removeConnect(socket.id)
        })

        socket.on('send-message', (data) => {
            // console.log('send mesage', data)
            messageUpdate.handleDirectMessage(data)
        })
        socket.on('message-watched', (data) => {
            let { senderId, receiverId, conversationId } = data
            updateMessage.updateWatchedMessageStatus(senderId, receiverId, conversationId)
        })
        socket.on('message-received', (data) => {
            let { senderId, receiverId, conversationId } = data
            updateMessage.updateReceivedMessageStatus(senderId, receiverId, conversationId)
        })

        setInterval(() => {
            let activeConnections = socketStore.getAllActiveConnections()
            socket.emit('all-active-user', { activeUsers: activeConnections })
        }, 10000)
    })
}



module.exports = {
    registerSocketServer
}