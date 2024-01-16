const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    active: {
        type: Boolean,
    },
    hashTag: {
        type: String,
    },
    ownerMode: {
        type: String,
    },
    ownerId: {
        type: String,
    },
    ownerName: {
        type: String,
    },
    title: {
        type: String,
    },
    amount: {
        type: Number,
    },
    content: {
        type: {},
    },
    images: {
        type: [],
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
}, { versionKey: false })

const postModel = mongoose.model('posts', postSchema)

module.exports = postModel