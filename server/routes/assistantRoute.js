const express = require('express')

const {
    getAnswer
} = require('../controllers/assistantCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/get-answer', authMiddleware, getAnswer)

module.exports = router;