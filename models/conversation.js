const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }],
    date: {
        type: Date
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    groupName: {
        type: String,
        default: ''
    },
    avatarGroup: {
        type: String
    }
})

module.exports = mongoose.model('Conversation', conversationSchema)