const jwt = require('jsonwebtoken')

const verifyTokenSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token
        const decoded = jwt.verify(token, process.env.KEY_TOKEN)
        socket.userDetails = decoded
    } catch (err) {
        console.log(err, 'authSocket.js')
        if (err.name === 'TokenExpiredError') {
            const socketError = new Error("TokenExpire")
            return next(socketError)
        } else {
            const socketError = new Error("SocketError")
            return next(socketError)
        }
    }
    next()
}

module.exports = verifyTokenSocket;