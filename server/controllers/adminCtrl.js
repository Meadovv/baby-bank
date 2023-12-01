const chatModel = require('../models/chatModel')
const userModel = require('../models/userModel')

const loadUserChatList = async (req, res) => {
    await chatModel.distinct('from', {
        from: {$ne: '000000000000000000000000'}
    }).then(async (list) => {
        const users = []
        for(let i = 0; i < list.length; ++i) {
            await userModel.findById({ _id: list[i] })
            .then(user => {
                if(user) {
                    users.push({
                        _id: user._id,
                        name: user.name,
                        mode: user.mode,
                        status: 'read'
                    })
                }
            })
        }

        for(let i = 0; i < users.length; ++i) {
            const isUnread = await chatModel.findOne({
                from: users[i]._id,
                status: 'unread'
            })
            if(isUnread) {
                users[i].status = 'unread'
            }
        }

        users.sort((a, b) => (a.status < b.status) ? 1 : (a.status > b.status) ? -1 : 0)

        res.status(200).send({
            success: true,
            users: users
        })
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

module.exports = {
    loadUserChatList,
}