const express = require('express')

const {
    addItem,
    getItems,
    filter,
    getInformation
} = require('../controllers/storageCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/add-item', authMiddleware, addItem)

router.post('/get-items', authMiddleware, getItems)

router.post('/filter', authMiddleware, filter)

router.post('/get-information', authMiddleware, getInformation)

module.exports = router;