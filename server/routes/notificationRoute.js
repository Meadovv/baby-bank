const express = require('express')

const {
    deleteNotification,
    readNotification,
    getNotificationList,
    markNotification
} = require('../controllers/notificationCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/get-notification-list', authMiddleware, getNotificationList)

router.post('/read-notification', authMiddleware, readNotification)

router.post('/delete-notification', authMiddleware, deleteNotification)

router.post('/mark-notification', authMiddleware, markNotification)

module.exports = router;