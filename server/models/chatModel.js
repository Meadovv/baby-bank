const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    from: {
        type: String
    },
    to: {
        type: String
    },
    message: {
        type: String
    },
    status: {
        type: String
    },
    createDate: {
        type: Number
    }
})

const chatModel = mongoose.model('chats', chatSchema)

module.exports = chatModel