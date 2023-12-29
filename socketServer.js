const { Server } = require("socket.io");
const authSocket = require("./middleware/authSocket");
const socketStore = require("./socketStore");
const handleNewConnected = require("./socketHandle/handleNewConnect");
const { updateConversation } = require("./socketHandle/update/conversation");
const messageUpdate = require("./socketHandle/handleDirectMessage");
const { updateListFriends } = require("./socketHandle/update/friend");
const updateMessage = require("./socketHandle/update/message");
const jwt = require("jsonwebtoken");
const { verifyTokenSocket } = require("./middleware/authSocket");
const registerSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.use((socket, next) => {
        verifyTokenSocket(socket, next);
    });

    socketStore.setInstantSocket(io);

    io.on("connection", (socket) => {
        const userDetails = socket.handshake.auth?.userDetails;
        handleNewConnected(socket, userDetails);

        updateConversation(userDetails._id);
        updateListFriends(userDetails._id);
        let activeConnections = socketStore.getAllActiveConnections();
        socket.emit("all-active-user", { activeUsers: activeConnections });

        socket.on("disconnect", () => {
            socketStore.removeConnect(socket.id);
        });

        socket.on("send-message", (data) => {
            messageUpdate.handleDirectMessage(data);
        });
        socket.on("send-message-group", (data) => {
            messageUpdate.handleDirectMessageGroup(data);
        });
        socket.on("message-watched", (data) => {
            let { listMessage, conversationId } = data;
            updateMessage.updateWatchedMessageStatus(listMessage, conversationId);
        });
        socket.on("message-received", (data) => {
            let { listMessage, conversationId } = data;
            updateMessage.updateReceivedMessageStatus(listMessage, conversationId);
        });
        socket.on("check-token-expire", (userDetails) => {
            let connect = socketStore.getConnectedUser();
            // console.log(connect)
            try {
                const decoded = jwt.verify(userDetails.token, process.env.KEY_TOKEN);
                let userId = userDetails._id;
                let socketId = socketStore.getSocketIdFromUserId(userId);
                userDetails.token = "1234";
                const token = jwt.sign(
                    {
                        ...userDetails,
                    },
                    process.env.KEY_TOKEN,
                    {
                        expiresIn: process.env.EXPIRE_TOKEN,
                    },
                );
                io.to(socketId).emit("update-token", { token: token });
            } catch (err) {
                if (err.name === "TokenExpiredError") {
                    let userId = userDetails._id;
                    let socketId = socketStore.getSocketIdFromUserId(userId);
                    userDetails.token = "1234";
                    const token = jwt.sign(
                        {
                            ...userDetails,
                        },
                        process.env.KEY_TOKEN,
                        {
                            expiresIn: process.env.EXPIRE_TOKEN,
                        },
                    );
                    io.to(socketId).emit("update-token", { token: token });
                }
            }
        });

        setInterval(() => {
            let activeConnections = socketStore.getAllActiveConnections();
            socket.emit("all-active-user", { activeUsers: activeConnections });
        }, 60000);
    });
};

module.exports = {
    registerSocketServer,
};
