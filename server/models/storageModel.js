const mongoose = require('mongoose')

const storageSchema = new mongoose.Schema({
    action: {
        type: String,
    },
    owner: {
        type: String,
    },
    data: {
        type: {}
    },
    createDate: {
        type: Number
    }
}, { versionKey: false })

const storageModel = mongoose.model('storages', storageSchema)

module.exports = storageModel