const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        required: [
            true,
            'from is required'
        ]
    },
    to: {
        type: mongoose.Schema.ObjectId,
        required: [
            true,
            'to is required'
        ]
    },
    message: {
        type: {},
    },
    reply: {
        type: String,
    },
    status: {
        type: String
    },
    createDate: {
        type: Number
    }
})

const appointmentModel = mongoose.model('appointments', appointmentSchema)

module.exports = appointmentModel