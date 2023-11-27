
const express = require('express')
const {
    getAllUserPost,
    getAllPost,
    getUserPost,
    createPost,
    deletePost,
    updatePost,
    getPost
} = require('../controllers/postCtrl')

const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/get-all-user-post', authMiddleware, getAllUserPost)

router.post('/get-user-post', authMiddleware, getUserPost)

router.post('/get-all-post', authMiddleware, getAllPost)

router.post('/create-post', authMiddleware, createPost)

router.post('/update-post', authMiddleware, updatePost)

router.post('/delete-post', authMiddleware, deletePost)

router.post('/get-post', authMiddleware, getPost)

module.exports = router