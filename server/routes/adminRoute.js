const express = require('express')

const {
    loadUserChatList, getUserList, accountSetting
} = require('../controllers/adminCtrl')

const {
    adminMiddleware
} = require('../middleware/adminMiddleware')

const router = express.Router()

router.post('/get-user-chat-list', adminMiddleware, loadUserChatList)

router.post('/get-user-list', adminMiddleware, getUserList)

router.post('/account-setting', adminMiddleware, accountSetting)

module.exports = router;