const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    owner: {
        type: String,
    },
    message: {
        type: String,
    },
    appointmentId: {
        type: String,
    },
    link: {
        type: String,
    },
    status: {
        type: String,
    },
    createDate: {
        type: Number
    }
}, { versionKey: false })

const notificationModel = mongoose.model('notifications', notificationSchema)

module.exports = notificationModel