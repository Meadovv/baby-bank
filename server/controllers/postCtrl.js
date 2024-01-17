const postModel = require('../models/postModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

let getMilkDonationPostContent = (value) => {
    return content = {
        ops: [
            {
                insert: 'BÀI ĐĂNG CHO SỮA'
            },
            {
                attributes: {
                    align: 'center',
                    header: 2
                },
                insert: '\n'
            },
            {
                insert: '\n'
            },
            {
                insert: 'ĐÂY LÀ BÀI ĐĂNG CHO SỮA CỦA NGƯỜI DÙNG ĐĂNG TỪ HỆ THỐNG BABY BANK.'
            },
            {
                attributes: {
                    header: 3
                },
                insert: '\n'
            },
            {
                attributes: {
                    color: 'red'
                },
                insert: `LƯỢNG SỮA MUỐN CHO: ${value} (ml)`
            },
            {
                attributes: {
                    header: 1
                },
                insert: '\n'
            },
            {
                insert: 'Những lưu ý khi sử dụng sữa từ hệ thống BABY BANK:'
            },
            {
                attributes: {
                    header: 2
                },
                insert: '\n'
            },
            {
                insert: 'Cần lưu ý về chất lượng sữa'
            },
            {
                attributes: {
                    list: 'ordered'
                },
                insert: '\n'
            },
            {
                insert: 'Cần lưu ý về thời gian bảo quản của sữa'
            },
            {
                attributes: {
                    list: 'ordered'
                },
                insert: '\n'
            }
        ]
    }
}

let getAllUserPost = async (req, res) => {
    await postModel.find({
        ownerId: req.body.userId
    }).sort({ createDate: -1, active: -1 }).then(posts => {

        let postList = []

        posts.forEach(post => {
            post.images = []
            if(post.title === null) post.title = 'Bài đăng không có tiêu đề'
            postList.push(post)
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
            post.images = []
            if(post.title === null) post.title = 'Bài đăng không có tiêu đề'
            postList.push(post)
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

    console.log(req.body)

    if(req.body.type === 'organization' || req.body.type === 'hospital') {
        await userModel.find({
            active: true,
            mode: req.body.type
        }).then(users => {
            if(users.length) {
    
                const postList = []
                users.forEach(user => {
                    user.password = undefined

                    const lat = user.location.lat * 0.01745329252
                    const lng = user.location.lng * 0.01745329252
                    const distance = 
                        Math.round((6378 * Math.acos(Math.sin(userRadianLat) * Math.sin(lat) + Math.cos(userRadianLat) * Math.cos(lat) * Math.cos(lng - userRadianLng))))

                    if(Number(req.body.filter.distance) !== 0 && distance > Number(req.body.filter.distance)) return

                    postList.push(user)
                })
    
                res.status(200).send({
                    success: true,
                    message: 'Lấy bài đăng thành công',
                    postList: postList
                })
            } else {
                res.status(200).send({
                    success: false,
                    message: 'Không tìm thấy bài đăng'
                })
            }
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
    } else {
        let key = {
            active: true,
            amount: {$gt: req.body.filter.amount - 1}
        }
        if(req.body.type !== 'all') {
            key['hashTag'] = req.body.type
        }

        if(req.body.ownerId !== null) {
            key['ownerId'] = req.body.ownerId
        }
        await postModel.find(key).then(posts => {
            if(posts.length) {
    
                const postList = []
                posts.forEach(post => {
                    post.images = []
                    if(post.title === null) post.title = 'Bài đăng không có tiêu đề'

                    const lat = post.lat * 0.01745329252
                    const lng = post.lng * 0.01745329252
                    const distance = 
                        Math.round((6378 * Math.acos(Math.sin(userRadianLat) * Math.sin(lat) + Math.cos(userRadianLat) * Math.cos(lat) * Math.cos(lng - userRadianLng))))

                    if(Number(req.body.filter.distance) !== 0 && distance > Number(req.body.filter.distance)) return

                    postList.push(post)
                })
    
                res.status(200).send({
                    success: true,
                    message: 'Lấy bài đăng thành công',
                    postList: postList
                })
            } else {
                res.status(200).send({
                    success: false,
                    message: 'Không tìm thấy bài đăng'
                })
            }
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
    }
}

let createPost = async (req, res) => {
    try {
        let postContent = null
        if(req.body.hashTag === 'milk') postContent = getMilkDonationPostContent(req.body.amount)
        else postContent = req.body.content

        const newPost = postModel({
            active: true,
            ownerMode: req.body.userRole,
            ownerId: req.body.userId,
            ownerName: req.body.ownerName,
            hashTag: req.body.hashTag,
            title: req.body.title,
            amount: req.body.amount,
            content: postContent,
            images: req.body.images,
            lat: req.body.lat,
            lng: req.body.lng,
            createDate: Date.now()
        })

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

let updatePost = async (req, res) => {
    await postModel.findByIdAndUpdate({
        _id: req.body.post._id
    }, req.body.post)
        .then(async post => {
            if (post) {
                if(post.hashTag === 'milk') {
                    post.content = getMilkDonationPostContent(req.body.post.amount)
                    await post.save()
                }
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
    await postModel.findById({
        _id: req.body.postId
    }).then(post => {
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

const switchPost = async (req, res) => {
    try {
        const post = await postModel.findById({
            _id: req.body.postId
        })

        if(post) {
            post.active = !post.active
            await post.save()

            res.status(200).send({
                success: true,
                message: 'Cập nhật thành công'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Bài đăng không tồn tại'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    getAllUserPost,
    getUserPost,
    getAllPost,
    createPost,
    updatePost,
    getPost,
    switchPost
}