const express = require('express')

const {
    sendReport
} = require('../controllers/reportCtrl')

const {
    authMiddleware
} = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/send-report', authMiddleware, sendReport)

module.exports = router;