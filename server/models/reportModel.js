const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    from: {
        type: String
    },
    to: {
        type: String
    },
    type: {
        type: String
    },
    content: {
        type: String
    },
    createDate: {
        type: Number
    }
})

const reportModel = mongoose.model('reports', reportSchema)

module.exports = reportModel