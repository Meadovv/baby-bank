const express = require('express')
const {
    loginController, 
    registerController, 
    getUserData,
    getProfileData,
    updateUser,
    changePassword,
    sendVerifyCode
} = require('../controllers/authCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', loginController)

router.post('/register', registerController)

router.post('/send-verify-code', sendVerifyCode)

router.post('/update-user-data', authMiddleware, updateUser)

router.post('/get-user-data', authMiddleware, getUserData)

router.post('/get-profile-data', authMiddleware, getProfileData)

router.post('/change-password', authMiddleware, changePassword)

module.exports = router;