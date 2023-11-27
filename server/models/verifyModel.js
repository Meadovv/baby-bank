const mongoose = require('mongoose')

const verifySchema = new mongoose.Schema({
    owner: {
        type: String
    },
    code: {
        type: Number
    },
    expired: {
        type: String
    }
})

const verifyModel = mongoose.model('verify', verifySchema)

module.exports = verifyModel