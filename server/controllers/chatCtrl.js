const chatModel = require('../models/chatModel')

const loadHistory = async (req, res) => {

    await chatModel.find({
        $or: [
            {
                from: req.body.targetId ? req.body.targetId : req.body.userId
            },
            {
                to: req.body.targetId ? req.body.targetId : req.body.userId
            }
        ]
    }).then(records => {
        let message = []
        records.forEach(record => {
            if(record.to === req.body.userId) {
                message.push({
                    key: record.createDate,
                    role: 'bot',
                    content: record.message
                })
            } else {
                message.push({
                    key: record.createDate,
                    role: 'user',
                    content: record.message
                })
            }
        })

        res.status(200).send({
            success: true,
            message: message
        })
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const sendChat = async (req, res) => {

    const newChat = new chatModel({
        from: req.body.userId,
        to: '000000000000000000000000',
        message: req.body.question,
        status: 'unread',
        createDate: Date.now()
    })

    await newChat.save()

    res.status(200).send({
        success: true,
        message: 'Phản hồi của bạn đã được lưu lại. Chúng tôi sẽ liên lạc lại với bạn qua Email. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.'
    })
}

module.exports = {
    sendChat,
    loadHistory
}