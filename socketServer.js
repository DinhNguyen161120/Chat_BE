

const { Server } = require('socket.io')
const authSocket = require('./middleware/authSocket')
const socketStore = require('./socketStore')
const handleNewConnected = require('./socketHandle/handleNewConnect')
const conversationUpdate = require('./socketHandle/update/conversation')
const messageUpdate = require('./socketHandle/handleDirectMessage')

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

    io.use((socket, next) => {

        const userDetails = socket.handshake.auth?.userDetails
        const check = socketStore.checkUserOnline(userDetails._id)
        if (check) {
            const socketError = new Error("UserConnected")
            next(socketError)
        } else {
            next()
        }
    })

    socketStore.setInstantSocket(io)

    io.on('connection', (socket) => {
        const userDetails = socket.handshake.auth?.userDetails
        handleNewConnected(socket, userDetails)

        conversationUpdate.updateConversation(userDetails._id)


        socket.on('disconnect', () => {
            socketStore.removeConnect(socket.id)
        })

        socket.on('send-message', (data) => {
            messageUpdate.handleDirectMessage(data)
        })
    })
}



module.exports = {
    registerSocketServer
}