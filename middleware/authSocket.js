const jwt = require("jsonwebtoken");
const socketStore = require("../socketStore");
const verifyTokenSocket = async (socket, next) => {
    try {
        const { userDetails, accessToken } = socket.handshake.auth;
        const decoded = jwt.verify(accessToken, process.env.KEY_TOKEN);
        socket.userDetails = userDetails;
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            const socketError = new Error("TokenExpiredError");
            return next(socketError);
        } else {
            const socketError = new Error("SocketError");
            return next(socketError);
        }
    }
    next();
};

module.exports = {
    verifyTokenSocket,
};
