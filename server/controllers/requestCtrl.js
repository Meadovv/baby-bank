const requestModel = require('../models/requestModel')
const postModel = require('../models/postModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')
const storageModel = require('../models/storageModel')

const createRequest = async (req, res) => {
    try {

        const post = await postModel.findById({
            _id: req.body.data.postId
        })

        if (post?.active === false || post === null) {
            return res.status(200).send({
                success: false,
                message: 'Bài đăng không tồn tại'
            })
        }

        const toUser = await userModel.findById({
            _id: post.ownerId
        })
        toUser.password = undefined

        const fromUser = await userModel.findById({
            _id: req.body.userId
        })
        fromUser.password = undefined

        const newRequest = new requestModel({
            from: fromUser,
            to: toUser,
            data: req.body.data,
            status: 'pending',
            createDate: Date.now()
        })

        await newRequest.save()

        return res.status(200).send({
            success: true,
            message: 'Tạo yêu cầu thành công'
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: err.message
        })

    }
}

const getRequestList = async (req, res) => {
    console.log(req.body)
    try {

        const userId = new mongoose.Types.ObjectId(req.body.userId)
        const query = {
            $or: [
                { 'from._id': userId },
                { 'to._id': userId }
            ]
        }
        if (req.body.status !== 'all') {
            query.status = req.body.status
        }

        const requestList = await requestModel.find(query).sort({createDate: -1})


        return res.status(200).send({
            success: true,
            message: 'Lấy danh sách yêu cầu thành công',
            requestList: requestList
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

const approveRequest = async (req, res) => {
    try {
        const request = await requestModel.findById({
            _id: req.body.requestId
        })

        if (request === null) {
            return res.status(200).send({
                success: false,
                message: 'Yêu cầu không tồn tại'
            })
        }

        if (request.status === 'completed') {
            return res.status(200).send({
                success: false,
                message: 'Yêu cầu đã hoàn thành'
            })

        }

        if (request.status === 'rejected') {
            return res.status(200).send({
                success: false,
                message: 'Yêu cầu đã bị từ chối'
            })
        }

        if (request.to._id.toString() !== req.body.userId) {
            return res.status(200).send({
                success: false,
                message: 'Bạn không có quyền duyệt yêu cầu này'
            })
        }

        const post = await postModel.findById({
            _id: request.data.postId
        })

        if (post === null) {
            return res.status(200).send({
                success: false,
                message: 'Bài đăng không tồn tại'
            })
        }

        if (post.active === false) {
            return res.status(200).send({
                success: false,
                message: 'Bài đăng đã bị xóa'
            })
        }

        if (post.ownerId.toString() !== req.body.userId) {
            return res.status(200).send({
                success: false,
                message: 'Bạn không có quyền duyệt yêu cầu này'
            })
        }

        if (request.status === 'approved') {

            request.status = 'completed'
            post.active = false

            await post.save()
            await request.save()

            if(request.data.type === 'donation') {
                const newStorage = new storageModel({
                    action: 'add',
                    owner: request.to._id,
                    from: {
                        name: request.from.name,
                        _id: request.from._id,
                    },
                    data: {
                        name: request.data.name,
                        amount: request.data.amount,
                        unit: request.data.unit,
                        note: request.data.note,
                    },
                    createDate: Date.now()
                })

                await newStorage.save()
            }

            return res.status(200).send({
                success: true,
                message: 'Xác nhận hoàn thành cuộc hẹn'
            })
        }

        request.status = 'approved'

        await request.save()

        return res.status(200).send({
            success: true,
            message: 'Duyệt yêu cầu thành công'
        })

    } catch (err) {
        console.log(err)
        return
    }
}

const rejectRequest = async (req, res) => {
    try {
        const request = await requestModel.findById({
            _id: req.body.requestId
        })

        if (request === null) {
            return res.status(200).send({
                success: false,
                message: 'Yêu cầu không tồn tại'
            })
        }

        if (request.status === 'completed') {
            return res.status(200).send({
                success: false,
                message: 'Yêu cầu đã hoàn thành'
            })

        }

        if (request.status === 'rejected') {
            return res.status(200).send({
                success: false,
                message: 'Yêu cầu đã bị từ chối trước đó'
            })
        }

        if (request.to._id.toString() !== req.body.userId) {
            return res.status(200).send({
                success: false,
                message: 'Bạn không có quyền duyệt yêu cầu này'
            })
        }

        const post = await postModel.findById({
            _id: request.data.postId
        })

        if (post === null) {
            return res.status(200).send({
                success: false,
                message: 'Bài đăng không tồn tại'
            })
        }

        if (post.ownerId.toString() !== req.body.userId) {
            return res.status(200).send({
                success: false,
                message: 'Bạn không có quyền duyệt yêu cầu này'
            })
        }

        request.status = 'rejected'

        await request.save()

        return res.status(200).send({
            success: true,
            message: 'Duyệt yêu cầu thành công'
        })

    } catch (err) {
        console.log(err)
        return
    }
}

module.exports = {
    createRequest,
    getRequestList,
    approveRequest,
    rejectRequest
}