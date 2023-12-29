const jwt = require("jsonwebtoken");
const KeyTokenService = require("../services/keyToken.service");

const verifyTokenSocket = async (socket, next) => {
    try {
        const { userDetails, accessToken } = socket.handshake.auth;
        const publicKey = await KeyTokenService.getPublicKeyFromUserId({
            userId: userDetails._id,
        });
        const decoded = jwt.verify(accessToken, publicKey);
        socket.userDetails = userDetails;
    } catch (err) {
        console.log("error authSocket.js", err);
        if (err.name === "TokenExpiredError") {
            const socketError = new Error("TokenExpire");
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
