const express = require('express')

const {
    getNotifications,
    deleteNotification,
    markAsRead,
    sendAll
} = require('../controllers/notificationCtrl')

const {
    authMiddleware
} = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/get-all-notification', authMiddleware, getNotifications)
router.post('/mark-as-read', authMiddleware, markAsRead)
router.post('/delete-notification', authMiddleware, deleteNotification)
router.post('/send-all', authMiddleware, sendAll)

module.exports = router;