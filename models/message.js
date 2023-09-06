const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    type: {
        type: String
    },
    isAnnounceFromServer: {
        type: Boolean
    },
    typeAnnounce: {
        type: String
    },
    date: {
        type: Date
    },
    status: {
        type: String
    }
})

module.exports = mongoose.model('Message', messageSchema)