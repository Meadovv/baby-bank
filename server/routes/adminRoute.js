const express = require('express')

const {
    loadUserChatList
} = require('../controllers/adminCtrl')

const {
    adminMiddleware
} = require('../middleware/adminMiddleware')

const router = express.Router()

router.post('/get-user-chat-list', adminMiddleware, loadUserChatList)

module.exports = router;