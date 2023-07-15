

const { Server } = require('socket.io')
const authSocket = require('./middleware/authSocket')
const socketStore = require('./socketStore')
const handleNewConnected = require('./socketHandle/handleNewConnect')

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
        const check = socketStore.checkUserExit(userDetails._id)
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



        socket.on('disconnect', () => {
            socketStore.removeConnect(socket.id)
        })
    })
}



module.exports = {
    registerSocketServer
}