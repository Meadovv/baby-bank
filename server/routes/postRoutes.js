
const express = require('express')
const {
    getAllUserPost,
    getAllPost,
    getUserPost,
    createPost,
    updatePost,
    getPost,
    switchPost
} = require('../controllers/postCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/get-all-user-post', authMiddleware, getAllUserPost)

router.post('/get-user-post', authMiddleware, getUserPost)

router.post('/get-all-post', authMiddleware, getAllPost)

router.post('/create-post', authMiddleware, createPost)

router.post('/update-post', authMiddleware, updatePost)

router.post('/get-post', authMiddleware, getPost)

router.post('/switch-post', authMiddleware, switchPost)

module.exports = router