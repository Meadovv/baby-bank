const mongoose = require('mongoose')

const storageSchema = new mongoose.Schema({
    owner: {
        type: String
    },
    from: {
        type: String
    },
    action: {
        type: String
    },
    amount: {
        type: String
    },
    createDate: {
        type: Number
    }
})

const storageModel = mongoose.model('storages', storageSchema)

module.exports = storageModel