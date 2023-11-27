const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    from: {
        type: {},
    },
    to: {
        type: {},
    },
    type: {
        type: String,
    },
    content: {
        type: {}
    },
    status: {
        type: String,
    },
    appointmentId: {
        type: String,
    },
    createDate: {
        type: Number
    }
})

const requestModel = mongoose.model('requests', requestSchema)

module.exports = requestModel