const chatModel = require('../models/chatModel')
const userModel = require('../models/userModel')
const postModel = require('../models/postModel')

const loadUserChatList = async (req, res) => {
    await chatModel.distinct('from', {
        from: {$ne: '000000000000000000000000'}
    }).then(async (list) => {
        const users = []
        for(let i = 0; i < list.length; ++i) {
            await userModel.findById({ _id: list[i] })
            .then(user => {
                if(user) {
                    users.push({
                        _id: user._id,
                        name: user.name,
                        mode: user.mode,
                        status: 'read'
                    })
                }
            })
        }

        for(let i = 0; i < users.length; ++i) {
            const isUnread = await chatModel.findOne({
                from: users[i]._id,
                status: 'unread'
            })
            if(isUnread) {
                users[i].status = 'unread'
            }
        }

        users.sort((a, b) => (a.status < b.status) ? 1 : (a.status > b.status) ? -1 : 0)

        res.status(200).send({
            success: true,
            users: users
        })
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const getUserList = async (req, res) => {

    let findKey = {
        mode: {$ne: 'admin'}
    }

    if(req.body.key.length === 24) {
        findKey['_id'] = req.body.key
    }

    await userModel.find(findKey)
    .then(users => {

        let userList = []
        users.forEach(user => {
            userList.push({
                _id: user._id,
                name: user.name,
                username: user.username,
                active: user.active,
                mode: user.mode
            })
        })

        res.status(200).send({
            success: true,
            userList: userList
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const getPostList = async (req, res) => {
    let findKey = {
        mode: {$ne: 'admin'}
    }

    if(req.body.key.length === 24) {
        findKey['_id'] = req.body.key
    }

    await postModel.find(findKey)
    .then(posts => {

        let postList = []
        posts.forEach(post => {
            postList.push({
                _id: post._id,
                ownerId: post.ownerId,
                ownerName: post.ownerName,
                title: post.title,
                active: post.active,
                mode: post.mode
            })
        })

        res.status(200).send({
            success: true,
            postList: postList
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const accountSetting = async (req, res) => {
    await userModel.findById({
        _id: req.body._id
    }).then(async (user) => {
        if(user) {
            user[req.body.key] = req.body.value

            await user.save()

            res.status(200).send({
                success: true,
                message: 'Thay đổi thành công'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không tìm thấy người dùng'
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

const postSetting = async (req, res) => {
    await postModel.findById({
        _id: req.body._id
    }).then(async (post) => {
        if(post) {
            post[req.body.key] = req.body.value

            await post.save()

            res.status(200).send({
                success: true,
                message: 'Thay đổi thành công'
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


module.exports = {
    loadUserChatList,
    getUserList,
    accountSetting,
    getPostList,
    postSetting
}