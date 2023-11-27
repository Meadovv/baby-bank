const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    owner: {
        type: String,
    },
    status: {
        type: String,
    },
    message: {
        type: String,
    },
    link: {
        type: String,
    },
    createDate: {
        type: Number
    }
})

const notificationModel = mongoose.model('notifications', notificationSchema)

module.exports = notificationModel