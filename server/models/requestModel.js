const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    from: {
        type: {},
    },
    to: {
        type: {},
    },
    data: {
        type: {}
    },
    status: {
        type: String,
    },
    createDate: {
        type: Number
    }
}, { versionKey: false })

const requestModel = mongoose.model('requests', requestSchema)

module.exports = requestModel