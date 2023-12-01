const express = require('express')

const {
    sendChat, 
    loadHistory
} = require('../controllers/chatCtrl')

const {
    authMiddleware
} = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/send-chat', authMiddleware, sendChat)

router.post('/load-history', authMiddleware, loadHistory)

module.exports = router;