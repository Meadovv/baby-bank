const express = require('express')

const {
    getChatHistory,
    sendMessage,
    getChatList
} = require('../controllers/chatCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/get-chat-history', authMiddleware, getChatHistory)

router.post('/send-message', authMiddleware, sendMessage)

router.post('/get-chat-list', authMiddleware, getChatList)

module.exports = router;