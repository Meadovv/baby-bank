const express = require('express')

const {
    storageAction,
    getStorage,
    getChart,
    getHistory
} = require('../controllers/storageCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/action', authMiddleware, storageAction)

router.post('/get-storage', authMiddleware, getStorage)

router.post('/get-chart', authMiddleware, getChart)

router.post('/get-history', authMiddleware, getHistory)

module.exports = router;