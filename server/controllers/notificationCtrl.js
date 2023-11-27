const notificationModel = require('../models/notificationModel')
const userModel = require('../models/userModel')

const {
    sendMail
} = require('./mailerCtrl')

const getNotifications = async (req, res) => {
    await notificationModel.find({
        owner: req.body.userId
    }).sort({status: -1, createDate: -1}).then(notifications => {
        let unreadCount = 0
        notifications.forEach(notification => {
            if(notification.status === 'unread') unreadCount++
        })

        res.status(200).send({
            success: true,
            notificationList: {
                unread: unreadCount,
                list: notifications
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const createNotification = async ({owner, message, link}) => {
    const newNotification = new notificationModel({
        owner: owner,
        status: 'unread',
        message: message,
        link: link,
        createDate: Date.now()
    })

    await newNotification.save()
}

const deleteNotification = async (req, res) => {
    await notificationModel.findByIdAndDelete({
        _id: req.body.notificationId
    }).then(notification => {
        if(notification) {
            res.status(200).send({
                success: true,
                message: 'Xóa thông báo thành công'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không tìm thấy thông báo'
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

const markAsRead = async (req, res) => {
    await notificationModel.findById({
        _id: req.body.notificationId
    }).then(async (notification) => {
        if(notification) {
            notification.status = 'read'
            await notification.save()

            return res.status(200).send({
                success: true,
                message: 'Đã thay đổi'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không tìm thấy thông báo'
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

let sendAll = async (req, res) => {

    const userRadianLat = req.body.location.lat ? req.body.location.lat * 0.01745329252 : 0
    const userRadianLng = req.body.location.lng ? req.body.location.lng * 0.01745329252 : 0

    await userModel.find({
        mode: 'individual'
    }).then(users => {

        let to = ''
        let counter = 0

        users.forEach(user => {

            const lat = user.location.lat * 0.01745329252
            const lng = user.location.lng * 0.01745329252

            const distance = 
                Math.round((6378 * Math.acos(Math.sin(userRadianLat) * Math.sin(lat) + Math.cos(userRadianLat) * Math.cos(lat) * Math.cos(lng - userRadianLng))))

            if(distance < Number(req.body.distance)) {
                to = to + user.email.value + ','
            }

            createNotification({
                owner: user._id,
                message: req.body.message,
                link: `/profile/${req.body.userId}`
            })
            counter = counter + 1
        })

        sendMail({
            to: to,
            subject: 'THÔNG BÁO TỪ WARM MILK',
            htmlContent: '<h1>Bạn có thông báo mới từ WARM MILK</h1>'
        })

        res.status(200).send({
            success: true,
            message: `Đã gửi tin nhắn cho ${counter} người`
        })

    }).catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

module.exports = {
    getNotifications,
    createNotification,
    deleteNotification,
    markAsRead,
    sendAll
}