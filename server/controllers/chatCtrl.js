const chatModel = require('../models/chatModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

const getChatHistory = async (req, res) => {
    try {
        if(req.body.id[0] === null || req.body.id[1] === null) {
            return res.status(200).send({
                success: false,
                message: 'Missing id!'
            })
        }

        const id0 = new mongoose.Types.ObjectId(req.body.id[0])
        const id1 = new mongoose.Types.ObjectId(req.body.id[1])

        const chatHistory = await chatModel.find({
            $or: [
                {'from._id': id0, 'to._id': id1},
                {'from._id': id1, 'to._id': id0},
            ]
        })

        let chat = null

        if(chatHistory.length === 0) {

            const fromUser = await userModel.findById({_id: req.body.id[0]})
            const toUser = await userModel.findById({_id: req.body.id[1]})


            const newChat = new chatModel({
                active: false,
                from: {
                    _id: fromUser._id,
                    name: fromUser.name,
                    mode: fromUser.mode
                },
                to: {
                    _id: toUser._id,
                    name: toUser.name,
                    mode: toUser.mode
                },
                data: [],
                createDate: Date.now()
            })

            await newChat.save()

            chat = newChat
        } else {
            chat = chatHistory[0]
        }



        return res.status(200).send({
            success: true,
            message: 'Chat history found!',
            chat: chat
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

const sendMessage = async (req, res) => {
    try {
        const chat = await chatModel.findById({
            _id: req.body.chatId
        })

        if(!chat) {
            return res.status(200).send({
                success: false,
                message: 'Chat not found!'
            })
        }

        chat.data.push(req.body.message)

        await chat.save()

        return res.status(200).send({
            success: true,
            message: 'Message sent!',
            chat: chat
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

const getChatList = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId)
        const chats = await chatModel.find({
            $or: [
                {'from._id': userId},
                {'to._id': userId},
            ]
        })

        if(!chats.length) {
            return res.status(200).send({
                success: false,
                message: 'Chat list not found!'
            })
        }

        const chatList = []

        chats.forEach(chat => {
            if(!chat.data.length) return
            if(chat.from._id.toString() === userId.toString()) {
                chatList.push({
                    _id: chat.to._id,
                    name: chat.to.name,
                    mode: chat.to.mode,
                    last: chat.data[chat.data.length - 1]
                })
            } else {
                chatList.push({
                    _id: chat.from._id,
                    name: chat.from.name,
                    mode: chat.from.mode,
                    last: chat.data[chat.data.length - 1]
                })
            }
        })

        return res.status(200).send({
            success: true,
            message: 'Chat list found!',
            chats: chatList
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    getChatHistory,
    sendMessage,
    getChatList
}