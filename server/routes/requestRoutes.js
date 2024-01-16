const express = require('express')

const {
    createRequest,
    getRequestList,
    approveRequest,
    rejectRequest
} = require('../controllers/requestCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/create-request', authMiddleware, createRequest)

router.post('/get-all-request', authMiddleware, getRequestList)

router.post('/approve-request', authMiddleware, approveRequest)

router.post('/reject-request', authMiddleware, rejectRequest)

module.exports = router;