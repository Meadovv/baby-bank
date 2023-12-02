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
    }).then(async (records) => {
        let message = []
        for(let i = 0; i < records.length; ++i) {
            if(records[i].to === req.body.userId) {
                message.push({
                    key: records[i].createDate,
                    role: 'bot',
                    content: records[i].message
                })
            } else {
                message.push({
                    key: records[i].createDate,
                    role: 'user',
                    content: records[i].message
                })
            }
            records[i].status = 'read'
            await records[i].save()
        }

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
        to: req.body.to,
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