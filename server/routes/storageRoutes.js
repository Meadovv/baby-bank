const express = require('express')

const {
    addItem,
    removeItem,
    updateItem,
    getItems
} = require('../controllers/storageCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/add-item', authMiddleware, addItem)

router.post('/remove-item', authMiddleware, removeItem)

router.post('/update-item', authMiddleware, updateItem)

router.post('/get-items', authMiddleware, getItems)

module.exports = router;