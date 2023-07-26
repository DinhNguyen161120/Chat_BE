
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    role: {
        type: String
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    status: {
        type: String
    },
    avatar: {
        type: String
    },
    sex: {
        type: String
    },
    birthday: {
        type: Date
    }
})

module.exports = mongoose.model('User', userSchema)