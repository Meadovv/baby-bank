const postModel = require('../models/postModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

let getAllUserPost = async (req, res) => {
    await postModel.find({
        ownerId: req.body.user
    }).limit(Number(req.body.limit)).sort({ createDate: -1, active: -1 }).then(posts => {

        let postList = []

        posts.forEach(post => {
            postList.push({
                _id: post._id,
                active: post.active,
                user: post.ownerName,
                mode: post.mode,
                title: post.title,
                time: post.createDate
            })
        })

        res.status(200).send({
            success: true,
            message: 'Lấy bài đăng thành công',
            postList: postList
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

let getUserPost = async (req, res) => {
    await postModel.find({
        ownerId: req.body.user,
        active: true
    }).limit(Number(req.body.limit)).sort({ createDate: -1 }).then(posts => {

        let postList = []

        posts.forEach(post => {
            postList.push({
                _id: post._id,
                active: post.active,
                user: post.ownerName,
                mode: post.mode,
                title: post.title,
                time: post.createDate
            })
        })

        res.status(200).send({
            success: true,
            message: 'Lấy bài đăng thành công',
            postList: postList
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

let getAllPost = async (req, res) => {

    let userRadianLat = 0
    let userRadianLng = 0

    try {
        userRadianLat = req.body.location.lat * 0.01745329252
        userRadianLng = req.body.location.lng * 0.01745329252
    } catch (err) {
        userRadianLat = 0
        userRadianLng = 0
    }

    let findKey = {}

    if (req.body.type === 'all') {
        findKey = {
            active: true
        }
    } else {
        findKey = {
            active: true,
            mode: req.body.type === 'milk' ? 'individual' : req.body.type === 'donation' ? 'organization' : req.body.type === 'knowledge' ? 'hospital' : 'admin'
        }
    }

    if (req.body.type === 'milk') {
        findKey['amount'] = { $gt: req.body.min }
    }

    findKey['ownerId'] = { $ne: req.body.userId }

    await postModel.find(findKey).sort({createDate: -1})
        .then(posts => {
            if (posts.length > 0) {

                let postList = []

                posts.forEach(post => {

                    const lat = post.lat * 0.01745329252
                    const lng = post.lng * 0.01745329252
        
                    const distance = 
                        Math.round((6378 * Math.acos(Math.sin(userRadianLat) * Math.sin(lat) + Math.cos(userRadianLat) * Math.cos(lat) * Math.cos(lng - userRadianLng))))

                    if(Number(req.body.distance) !== 0 && distance > Number(req.body.distance)) return

                    postList.push({
                        _id: post._id,
                        active: post.active,
                        user: post.ownerName,
                        mode: post.mode,
                        title: post.title,
                        time: post.createDate
                    })
                })

                res.status(200).send({
                    success: true,
                    postList: postList,
                    message: 'Lấy bài đăng thành công'
                })
            } else {
                res.status(200).send({
                    success: false,
                    message: 'Không có bài đăng hợp lệ'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
}

let createPost = async (req, res) => {
    try {
        const newPost = postModel(req.body.post)
        newPost.createDate = Date.now()
        newPost.active = true
        await newPost.save()

        res.status(200).send({
            success: true,
            message: 'Đăng bài thành công'
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

let deletePost = async (req, res) => {
    await postModel.findByIdAndDelete({
        _id: req.body.postId
    }).then(async (post) => {
        if (post) {
            res.status(200).send({
                success: true,
                message: 'Xóa bài đăng thành công'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không tìm thấy bài đăng'
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

let updatePost = async (req, res) => {
    await postModel.findByIdAndUpdate({
        _id: req.body.post._id
    }, req.body.post)
    .then(post => {
        if(post) {
            res.status(200).send({
                success: true,
                message: 'Bài đăng đã được cập nhật'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không tìm thấy bài đăng'
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

let getPost = async (req, res) => {

    if (req.body.postId.length < 24) {
        return res.status(200).send({
            success: false,
            message: 'Bài đăng không tồn tại',
            post: null
        })
    }

    await postModel.findById({
        _id: new mongoose.Types.ObjectId(req.body.postId)
    }).then(async (post) => {
        if (post) {
            res.status(200).send({
                success: true,
                message: 'Lấy bài đăng thành công',
                post: post
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Bài đăng không tồn tại',
                post: null
            })
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

module.exports = {
    getAllUserPost,
    getUserPost,
    getAllPost,
    createPost,
    deletePost,
    updatePost,
    getPost
}