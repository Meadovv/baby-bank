const storageModel = require('../models/storageModel')

let addItem = async (req, res) => {
    try {
        const data = req.body.data

        const newItem = new storageModel({
            action: 'add',
            owner: req.body.userId,
            from: {
                name: 'Quản trị viên',
                _id: req.body.userId
            },
            data: data,
            createDate: Date.now()
        })

        await newItem.save()

        res.status(200).send({
            success: true,
            message: 'Thêm thành công'
        })
    
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'Lỗi server'
        })
    
    }
}

let removeItem = async (req, res) => {

}

let updateItem = async (req, res) => {

}

let getItems = async (req, res) => {
    try {
        const storageList = await storageModel.find({
            owner: req.body.userId
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

module.exports = {
    addItem,
    removeItem,
    updateItem,
    getItems
}