const reportModel = require('../models/reportModel')

let sendReport = async (req, res) => {

    try {

        const newReport = new reportModel({
            from: req.body.userId,
            to: req.body.to,
            type: req.body.type,
            content: req.body.question,
            createDate: Date.now()
        })

        await newReport.save()

        res.status(200).send({
            success: true,
            message: 'Phản hồi của bạn đã được lưu lại. Chúng tôi sẽ liên lạc lại với bạn qua Email. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.'
        })
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    sendReport
}