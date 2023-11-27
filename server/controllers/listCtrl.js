const userModel = require('../models/userModel')

const getList = async (req, res) => {

    let userRadianLat = 0
    let userRadianLng = 0

    try {
    	userRadianLat = req.body.location.lat * 0.01745329252
    	userRadianLng = req.body.location.lng * 0.01745329252
    } catch (err) {
    	userRadianLat = 0
    	userRadianLng = 0
    }

    await userModel.find({
        mode: req.body.type,
	    _id: {$ne: req.body.userId}
    }).then(users => {

        let list = []
        users.forEach(user => {

            const lat = user.location.lat * 0.01745329252
            const lng = user.location.lng * 0.01745329252

            const distance = Math.round((6378 * Math.acos(Math.sin(userRadianLat) * Math.sin(lat) + Math.cos(userRadianLat) * Math.cos(lat) * Math.cos(lng - userRadianLng))))

            if(Number(req.body.distance) !== 0 && distance > Number(req.body.distance)) return

            list.push({
                _id: user._id,
                name: user.name,
                distance: distance
            })
        })

        res.status(200).send({
            success: true,
            list: list
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
    getList
}