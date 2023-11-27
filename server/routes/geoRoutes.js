const express = require('express')

const {
    getGeocoding
} = require('../controllers/goongioCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/get-geocoding', authMiddleware, getGeocoding)

module.exports = router;