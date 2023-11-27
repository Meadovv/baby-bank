const express = require('express')

const {
    getInformation,
    getNewPost,
    getNewAdminPost,
    getNewHospitalPost
} = require('../controllers/homeCtrl')

const router = express.Router()

router.get('/get-web-information', getInformation)

router.get('/get-new-post', getNewPost)

router.get('/get-hospital-new-post', getNewHospitalPost)

router.get('/get-admin-new-post', getNewAdminPost)

module.exports = router;