const requestModel = require('../models/requestModel')
const postModel = require('../models/postModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

const {
    createNotification
} = require('./notificationCtrl')

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
            await request.save()

            if(post.ownerMode === 'individual') {
                post.active = false
                await post.save()
            }

            return res.status(200).send({
                success: true,
                message: 'Xác nhận hoàn thành cuộc hẹn'
            })
        }

        request.status = 'approved'

        await request.save()

        await createNotification({
            owner: request.from._id,
            message: 'Yêu cầu của bạn đã được chấp nhận',
            appointmentId: request._id,
            link: `/appointment?status=approved`,
            status: 'unread',
            createDate: Date.now()
        })

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

        await createNotification({
            owner: request.from._id,
            message: 'Yêu cầu của bạn đã bị từ chối',
            appointmentId: request._id,
            link: `/appointment?status=rejected`,
            status: 'unread',
            createDate: Date.now()
        })

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