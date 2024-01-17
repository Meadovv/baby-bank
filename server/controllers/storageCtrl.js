const storageModel = require('../models/storageModel')

let addItem = async (req, res) => {
    try {

        let total = 0
        const storageList = await storageModel.find({
            owner: req.body.userId
        })
        storageList.forEach(item => {
            if(item.action === 'add') total = total + item.amount
            else total = total - item.amount
        })

        if(req.body.data.action === 'remove' && req.body.data.amount > total) {
            return res.status(200).send({
                success: false,
                message: 'Số lượng trong kho không đủ'
            })
        }

        const newItem = new storageModel({
            action: req.body.data.action,
            owner: req.body.userId,
            amount: req.body.data.amount,
            note: req.body.data.note,
            createDate: Date.now()
        })

        await newItem.save()

        res.status(200).send({
            success: true,
            message: 'Thành công'
        })
    
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'Lỗi server'
        })
    
    }
}

let getItems = async (req, res) => {
    try {
        const storageList = await storageModel.find({
            owner: req.body.userId,
            createDate: {
                $gt: req.body.start,
                $lt: req.body.end === 0 ? Date.now() : req.body.end
            }
        })

        res.status(200).send({
            success: true,
            storageList: storageList
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

const getInformation = async (req, res) => {
    const now = new Date();
    try {
        const itemList = await storageModel.find({
            owner: req.body.userId
        })

        data = {
            total: {
                total: 0,
                add: 0,
                remove: 0
            },
            now: {
                total: 0,
                add: 0,
                remove: 0
            },
            pre: {
                total: 0,
                add: 0,
                remove: 0
            }
        }

        itemList && itemList.forEach(item => {
            if(item.action === 'add') {
                data.total.total = data.total.total + item.amount
                data.total.add = data.total.add + item.amount
            } else {
                data.total.total = data.total.total - item.amount
                data.total.remove = data.total.remove + item.amount
            }

            if(item.createDate > (new Date(now.getFullYear(), now.getMonth(), 1).getTime()) &&
            item.createDate < (new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime())) {
                if(item.action === 'add') {
                    data.now.total = data.now.total + item.amount
                    data.now.add = data.now.add + item.amount
                } else {
                    data.now.total = data.now.total - item.amount
                    data.now.remove = data.now.remove + item.amount
                }
            }

            if(item.createDate > (new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime()) &&
            item.createDate < (new Date(now.getFullYear(), now.getMonth(), 0).getTime())) {
                if(item.action === 'add') {
                    data.pre.total = data.pre.total + item.amount
                    data.pre.add = data.pre.add + item.amount
                } else {
                    data.pre.total = data.pre.total - item.amount
                    data.pre.remove = data.pre.remove + item.amount
                }
            }
        })

        res.status(200).send({
            success: true,
            message: 'OK!',
            information: data
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

const filter = async (req, res) => {
    try {
        const itemList = await storageModel.find({
            owner: req.body.userId,
            createDate: {
                $gt: Number(req.body.start),
                $lt: Number(req.body.end),
            },
        })

        let total = 0
        let add = 0
        let remove = 0

        itemList && itemList.forEach(item => {
            if(item.action === 'add') {
                total = total + item.amount
                add = add + item.amount
            } else {
                total = total - item.amount
                remove = remove + item.amount
            }
        })

        res.status(200).send({
            success: true,
            message: 'Lọc thành công',
            filter: {
                total: total,
                add: add,
                remove: remove
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

module.exports = {
    addItem,
    getItems,
    filter,
    getInformation
}