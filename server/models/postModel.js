const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    active: {
        type: Boolean,
    },
    mode: {
        type: String,
    },
    ownerId: {
        type: mongoose.Schema.ObjectId,
    },
    ownerName: {
        type: String
    },
    writer: {
        type: String
    },
    title: {
        type: String,
    },
    content: {
        type: {},
    },
    amount: {
        type: Number,
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },
    createDate: {
        type: Number,
    }
})

const postModel = mongoose.model('posts', postSchema)

module.exports = postModel