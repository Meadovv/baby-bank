const express = require('express')

const {
    getNewPost,
    getNewAdminPost,
    getNewHospitalPost,
    getNewIndividualMilkPost,
    getNewIndividualNoMilkPost,
    getNewOrganizationPost
} = require('../controllers/homeCtrl')

const router = express.Router()

router.get('/get-new-post', getNewPost)

router.get('/get-hospital-new-post', getNewHospitalPost)

router.get('/get-individual-milk-new-post', getNewIndividualMilkPost)

router.get('/get-individual-no-milk-new-post', getNewIndividualNoMilkPost)

router.get('/get-organization-new-post', getNewOrganizationPost)

router.get('/get-admin-new-post', getNewAdminPost)

module.exports = router;