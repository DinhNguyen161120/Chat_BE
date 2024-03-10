const connectedUsers = new Map();
let io = null;

const setInstantSocket = (ioInstant) => {
    io = ioInstant;
};

const getInstantSocket = () => {
    return io;
};

const addNewConnectedUser = (socketId, userId) => {
    connectedUsers.set(socketId, userId);
};

const removeConnect = (socketId) => {
    connectedUsers.delete(socketId);
};

const checkUserOnline = (userId) => {
    let check = false;
    connectedUsers.forEach((value, key) => {
        if (value === userId) {
            check = true;
        }
    });
    return check;
};

const getActiveConnections = (userId) => {
    const activeConnections = [];
    connectedUsers.forEach((value, key) => {
        if (value === userId) activeConnections.push(key);
    });
    return activeConnections;
};

const getAllActiveConnections = () => {
    const activeConnections = [];
    connectedUsers.forEach((value, key) => {
        activeConnections.push(value);
    });
    return activeConnections;
};

const getSocketIdFromUserId = (userId) => {
    let activeConnections = "";
    connectedUsers.forEach((value, key) => {
        if (value === userId) activeConnections = key;
    });
    return activeConnections;
};

const getConnectedUser = () => {
    return connectedUsers;
};

module.exports = {
    setInstantSocket,
    addNewConnectedUser,
    getInstantSocket,
    removeConnect,
    checkUserOnline,
    getActiveConnections,
    getSocketIdFromUserId,
    getAllActiveConnections,
    getConnectedUser,
};
