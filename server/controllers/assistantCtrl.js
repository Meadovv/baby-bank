const axios = require('axios')

const TIME = 40000
const userLimit = new Map()

const getAnswer = async (req, res) => {

    if(userLimit.get(req.body.userId) === null) {
        userLimit.set(req.body.userId, 0)
    } else {
        if(Date.now() - userLimit.get(req.body.userId) < TIME) {
            return res.status(200).send({
                success: true,
                message: `Bạn có thể gửi câu hỏi sau ${Math.round(TIME/1000 - ((Date.now() - userLimit.get(req.body.userId)) / 1000))} giây nữa.`
            })
        } else {
            userLimit.set(req.body.userId, Date.now())
        }
    }

    await axios.post('http://127.0.0.1:8082/get-answer',
    {
        question: req.body.question
    },
    {

    }).then(assistantResponse => {
        if(assistantResponse.data.success) {
            res.status(200).send({
                success: true,
                message: assistantResponse.data.message
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Something went wrong!'
            })
        }
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

module.exports = {
    getAnswer
}