const express = require('express')

const {
    getList
} = require('../controllers/listCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/get-list', authMiddleware, getList)

module.exports = router;