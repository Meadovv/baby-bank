const express = require('express')

const {
    loadUserChatList, getUserList, accountSetting, getPostList, postSetting
} = require('../controllers/adminCtrl')

const {
    adminMiddleware
} = require('../middleware/adminMiddleware')

const router = express.Router()

router.post('/get-user-chat-list', adminMiddleware, loadUserChatList)

router.post('/get-user-list', adminMiddleware, getUserList)

router.post('/get-post-list', adminMiddleware, getPostList)

router.post('/account-setting', adminMiddleware, accountSetting)

router.post('/post-setting', adminMiddleware, postSetting)

module.exports = router;