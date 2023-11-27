const appointmentModel = require('../models/appointmentModel')
const userModel = require('../models/userModel')
const storageModel = require('../models/storageModel')
const postModel = require('../models/postModel')

let getAppointments = async (req, res) => {
    await appointmentModel.find({
        $or: [
            { 
                from: req.body.userId 
            },
            { 
                to: req.body.userId,
                status: { $ne: 'pending' }
            }
        ]
    }).then(appointments => {
        if (appointments.length > 0) {
            res.status(200).send({
                success: true,
                appointmentList: appointments,
                message: 'Success'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không có cuộc hẹn'
            })
        }
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

let getAppointment = async (req, res) => {
    await appointmentModel.findById({
        _id: req.body.appointmentId
    }).then(async (appointment) => {
        if (appointment) {

            const fromUser = await userModel.findById({
                _id: appointment.from
            })

            const toUser = await userModel.findById({
                _id: appointment.to
            })

            res.status(200).send({
                success: true,
                appointment: {
                    _id: appointment._id,
                    from: {
                        _id: fromUser._id,
                        name: fromUser.name
                    },
                    to: {
                        _id: toUser._id,
                        name: toUser.name
                    },
                    message: appointment.message,
                    reply: appointment.reply,
                    status: appointment.status,
                    createDate: appointment.createDate
                },
                message: 'Lấy cuộc hẹn thành công'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không tồn tại cuộc hẹn'
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

let createAppointment = async ({ from, to, message }) => {

    const newAppointment = new appointmentModel({
        from: from,
        to: to,
        message: message,
        status: 'pending',
        reply: 'Vui lòng đợi. Tôi trả lời bạn trong thời gian sớm nhất',
        createDate: Date.now()
    })

    await newAppointment.save()

    return newAppointment
}

let handleAppointment = async (req, res) => {
    await appointmentModel.findById({
        _id: req.body.appointmentId
    }).then(async (appointment) => {
        if(appointment) {
            appointment.status = req.body.status

            // cộng thêm (trừ đi) lượng sữa vào kho của bệnh viện nếu đồng ý
            if(appointment.message.data.request_type.split('_')[2] === 'hospital' && req.body.status === 'completed') {
                const storageRecord = new storageModel({
                    owner: appointment.to,
                    from: appointment.from,
                    action: appointment.message.data.request_type.split('_')[0] === 'cho' ? 'push' : 'pop',
                    amount: appointment.message.data.value,
                    createDate: Date.now()
                })
                await storageRecord.save()
            }
            
            await appointment.save()
    
            res.status(200).send({
                success: true,
                message: 'Đã lưu kết quả cuộc hẹn'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không tìm thấy cuộc hẹn'
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
    createAppointment,
    handleAppointment,
    getAppointments,
    getAppointment,
}