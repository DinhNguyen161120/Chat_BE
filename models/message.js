const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    content: {
        type: String
    },
    type: {
        type: String
    },
    date: {
        type: Number
    },
    status: {
        type: String
    }
})

module.exports = mongoose.model('Message', messageSchema)