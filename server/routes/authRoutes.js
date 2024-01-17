const express = require('express')
const {
    loginController, 
    registerController, 
    getUserData,
    getProfileData,
    updateUser,
    recovery,
    forgot,
    updateLocation,
    calling
} = require('../controllers/authCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', loginController)

router.post('/register', registerController)

router.post('/update-user-data', authMiddleware, updateUser)

router.post('/update-user-location', authMiddleware, updateLocation)

router.post('/get-user-data', authMiddleware, getUserData)

router.post('/get-profile-data', authMiddleware, getProfileData)

router.get('/recovery/:token', recovery)

router.post('/forgot', forgot)

router.post('/calling', authMiddleware, calling)

module.exports = router;