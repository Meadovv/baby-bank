const notificationModel = require('../models/notificationModel')
const userModel = require('../models/userModel')
const {
    sendMail
} = require('./mailerCtrl')

const createNotification = async ({
    owner, appointmentId, message, link
}) => {
    try {
        const newNotification = new notificationModel({
            owner, appointmentId, message, link, status: 'unread', createDate: Date.now()
        })

        const user = await userModel.findById({
            _id: owner
        })

        if(user) {
            sendMail({
                to: user.email.value,
                subject: 'THÔNG BÁO TỪ WARM MILK',
                htmlContent: '<h1>Bạn có thông báo mới từ WARM MILK</h1>'
            })
        }
        
        await newNotification.save()
    } catch (error) {
        console.log(error)
    }
}

const readNotification = async (req, res) => {
    try {
        const notification = await notificationModel.findById({
            _id: req.body.notificationId
        })
        if(!notification) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy thông báo'
            })
        } else {

            notification.status = 'read'
            await notification.save()

            return res.status(200).send({
                success: true,
                message: 'OK!',
                notification: notification
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const deleteNotification = async (req, res) => {
    try {
        const notification = await notificationModel.findByIdAndDelete({
            _id: req.body.notificationId
        })
        if(!notification) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy thông báo'
            })
        } else {
            return res.status(200).send({
                success: true,
                message: 'Xóa thông báo thành công'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const getNotificationList = async (req, res) => {
    try {
        const notificationList = await notificationModel.find({
            owner: req.body.userId
        }).sort({createDate: -1})

        return res.status(200).send({
            success: true,
            message: 'Lấy danh sách thông báo thành công',
            notificationList: notificationList
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const markNotification = async (req, res) => {
    try {
        const notification = await notificationModel.findById({
            _id: req.body.notificationId
        })
        if(!notification) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy thông báo'
            })
        } else {

            notification.status = 'unread'
            await notification.save()

            return res.status(200).send({
                success: true,
                message: 'OK!'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createNotification,
    readNotification,
    deleteNotification,
    getNotificationList,
    markNotification
}