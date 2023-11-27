const express = require('express')

const {
    handleAppointment,
    getAppointments,
    getAppointment
} = require('../controllers/appointmentCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/handle-appointment', authMiddleware, handleAppointment)

router.post('/get-all-appointment', authMiddleware, getAppointments)

router.post('/get-appointment', authMiddleware, getAppointment)

module.exports = router;