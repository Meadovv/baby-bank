const express = require('express')

const {
    sendRequest,
    getRequests,
    getRequest,
    handleRequest
} = require('../controllers/requestCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/send-request', authMiddleware, sendRequest)

router.post('/get-all-request', authMiddleware, getRequests)

router.post('/get-request', authMiddleware, getRequest)

router.post('/handle-request', authMiddleware, handleRequest)

module.exports = router;