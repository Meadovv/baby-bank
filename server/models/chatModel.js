const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    active: {
        type: Boolean,
    },
    from: {
        type: {},
    },
    to: {
        type: {},
    },
    data: {
        type: []
    },
    createDate: {
        type: Number
    }
}, { versionKey: false })

const chatModel = mongoose.model('chats', chatSchema)

module.exports = chatModel