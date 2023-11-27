const requestModel = require('../models/requestModel')
const userModel = require('../models/userModel')
const appointmentModel = require('../models/appointmentModel')

const {
    createNotification
} = require('./notificationCtrl')

const {
    sendMail
} = require('./mailerCtrl')

const { createAppointment } = require('./appointmentCtrl')

const sendRequest = async (req, res) => {
    try {

        const content = {
            post: req.body.post,
            data: req.body.data
        }

        // create appointment
        const newAppointment = await createAppointment({
            from: req.body.userId,
            to: req.body.to,
            message: content
        })

        const newRequest = requestModel({
            from: req.body.userId,
            to: req.body.to,
            type: req.body.type,
            content: content,
            status: 'pending',
            appointmentId: newAppointment.id,
            createDate: Date.now()
        })

        await newRequest.save()

        res.status(200).send({
            success: true,
            message: 'Gửi yêu cầu thành công'
        })

        // create notification to sender and receiver
        await createNotification({
            owner: req.body.userId,
            message: 'Yêu cầu của bạn đã được gửi đi',
            link: `/appointment?id=${newAppointment._id}`
        })

        await createNotification({
            owner: req.body.to,
            message: 'Bạn có một yêu cầu mới',
            link: `/request?id=${newRequest._id}`
        })

        await userModel.findById({
            _id: req.body.userId
        }).then(user => {
            if(user) {
                sendMail({
                    to: user.email.value,
                    subject: 'BẠN CÓ YÊU CẦU MỚI',
                    htmlContent: `<h3>${user.name} vừa gửi yêu cầu cho bạn. Ghé thăm trang Yêu cầu trên Warm Milk để biết thêm chi tiết</h3>`
                })
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

const getRequests = async (req, res) => {
    await requestModel.find({
        to: req.body.userId
    }).sort({ status: -1, createDate: -1 }).then(requests => {
        if (requests.length > 0) {
            res.status(200).send({
                success: true,
                requestList: requests,
                message: 'Lấy yêu cầu thành công'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không có yêu cầu'
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

const getRequest = async (req, res) => {
    await requestModel.findById({
        _id: req.body.requestId
    }).then(async (request) => {
        if (request) {

            const user = await userModel.findById({
                _id: request.from
            })

            user.password = null

            request.from = user

            res.status(200).send({
                success: true,
                request: request,
                message: 'Lấy yêu cầu thành công'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Yêu cầu không tồn tại'
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

const handleRequest = async (req, res) => {

    await appointmentModel.findById({
        _id: req.body.appointmentId
    }).then(async (appointment) => {
        if(appointment) {
            appointment.status = req.body.status
            if(req.body.status === 'approved') {
                appointment.reply = `Xin chào, tôi đồng ý với yêu cầu của bạn. Hẹn bạn tại ${req.body.data.address} vào lúc ${req.body.data.time}`
            } else {
                appointment.reply = 'Xin chào, vì một vài lí do, tôi không thể đồng ý với yêu cầu của bạn vào lúc này'
            }

            await appointment.save()

            if (req.body.status === 'approved') {
                await createNotification({
                    owner: appointment.from,
                    message: 'Yêu cầu của bạn đã được chấp nhận. Ghé thăm trang Cuộc hẹn để biết thêm thông tin.',
                    link: `/appointment?id=${appointment._id}`
                })
            } else {
                await createNotification({
                    owner: appointment.from,
                    message: 'Yêu cầu của bạn đã bị từ chối. Ghé thăm trang Cuộc hẹn để biết thêm thông tin.',
                    link: `/appointment?id=${appointment._id}`
                })
            }
        }
    }).catch(err => {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: err.message
        })
    })

    await requestModel.findById({
        _id: req.body.requestId
    }).then(async (request) => {
        if (request) {
            request.status = req.body.status

            await request.save()

            return res.status(200).send({
                success: 'true',
                message: req.body.status === 'approved' ? 'Đã đồng ý yêu cầu' : 'Đã từ chối yêu cầu'
            })
        } else {
            return res.status(200).send({
                success: false,
                message: 'Không tìm thấy yêu cầu'
            })
        }
    }).catch(err => {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

module.exports = {
    sendRequest,
    getRequests,
    getRequest,
    handleRequest,
}