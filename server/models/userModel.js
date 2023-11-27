const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: true
    }, // kích hoạt hoặc hủy kích hoạt tài khoản
    updated: {
        type: Boolean,
        default: false
    }, // trạng thái cập nhật thông tin
    name: {
        type: String,
        required: [
            true,
            'email is required'
        ]
    },
    username: {
        type: String,
        required: [
            true,
            'email is required'
        ]
    },
    password: {
        type: String,
        required: [
            true,
            'password is required'
        ]
    },
    mode: {
        type: String
    },
    location: {
        address: {
            type: String,
        },
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },
        private: {
            type: Boolean,
        }
    },
    email: {
        value: {
            type: String,
        },
        private: {
            type: Boolean,
        }
    },
    phone: {
        value: {
            type: String
        },
        private: {
            type: Boolean,
        }
    },
    createDate: {
        type: Number
    }
}, { versionKey: false })

const userModel = mongoose.model('users', userSchema)

module.exports = userModel