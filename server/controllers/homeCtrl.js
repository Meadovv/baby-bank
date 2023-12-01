const userModel = require('../models/userModel')
const postModel = require('../models/postModel')

let getInformation = async (req, res) => {

    const userAccount = await userModel.find({
        mode: { $ne: 'hospital' }
    })

    const hospitalAccount = await userModel.find({
        mode: 'hospital'
    })

    const post = await postModel.find({
        mode: { $ne: 'hospital' }
    })

    const hospitalPost = await postModel.find({
        mode: 'hospital'
    })

    // get information from begin this month

    const userAccountThisMonth = await userModel.find({
        mode: { $ne: 'hospital' },
        createDate: { $gt: (new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 1)).getTime() }
    })

    const hospitalAccountThisMonth = await userModel.find({
        mode: 'hospital',
        createDate: { $gt: (new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 1)).getTime() }
    })

    const postThisMonth = await postModel.find({
        mode: { $ne: 'hospital' },
        createDate: { $gt: (new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 1)).getTime() }
    })

    const hospitalPostThisMonth = await postModel.find({
        mode: 'hospital',
        createDate: { $gt: (new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 1)).getTime() }
    })

    res.status(200).send({
        user: userAccount.length,
        hospital: hospitalAccount.length,
        post: post.length,
        hospitalPost: hospitalPost.length,
        thisMonth: {
            user: userAccountThisMonth.length,
            hospital: hospitalAccountThisMonth.length,
            post: postThisMonth.length,
            hospitalPost: hospitalPostThisMonth.length,
        }
    })
}

const getNewPost = async (req, res) => {
    await postModel.find({
        mode: {$ne: 'hospital'},
        active: true
    }).limit(6).sort({ createDate: -1 })
        .then(posts => {
            let postList = []

            posts.forEach(post => {
                postList.push({
                    _id: post._id,
                    active: post.active,
                    user: post.ownerName,
                    mode: post.mode,
                    title: post.title,
                    amount: post.amount,
                    time: post.createDate
                })
            })

            res.status(200).send({
                success: true,
                message: 'Lấy bài đăng thành công',
                postList: postList
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
}

const getNewAdminPost = async (req, res) => {
    await postModel.find({
        mode: 'admin',
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            postList.push({
                _id: post._id,
                active: post.active,
                user: post.ownerName,
                mode: post.mode,
                title: post.title,
                amount: post.amount,
                time: post.createDate
            })
        })

        res.status(200).send({
            success: true,
            message: 'Lấy bài đăng thành công',
            postList: postList
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const getNewIndividualMilkPost = async (req, res) => {
    await postModel.find({
        mode: 'individual',
        amount: {$ne: -1},
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            postList.push({
                _id: post._id,
                active: post.active,
                user: post.ownerName,
                mode: post.mode,
                title: post.title,
                amount: post.amount,
                time: post.createDate
            })
        })

        res.status(200).send({
            success: true,
            message: 'Lấy bài đăng thành công',
            postList: postList
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const getNewIndividualNoMilkPost = async (req, res) => {
    await postModel.find({
        mode: 'individual',
        amount: -1,
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            postList.push({
                _id: post._id,
                active: post.active,
                user: post.ownerName,
                mode: post.mode,
                title: post.title,
                amount: post.amount,
                time: post.createDate
            })
        })

        res.status(200).send({
            success: true,
            message: 'Lấy bài đăng thành công',
            postList: postList
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const getNewOrganizationPost = async (req, res) => {
    await postModel.find({
        mode: 'organization',
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            postList.push({
                _id: post._id,
                active: post.active,
                user: post.ownerName,
                mode: post.mode,
                title: post.title,
                time: post.createDate
            })
        })

        res.status(200).send({
            success: true,
            message: 'Lấy bài đăng thành công',
            postList: postList
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const getNewHospitalPost = async (req, res) => {
    await postModel.find({
        mode: 'hospital',
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            postList.push({
                _id: post._id,
                active: post.active,
                user: post.ownerName,
                mode: post.mode,
                title: post.title,
                time: post.createDate
            })
        })

        res.status(200).send({
            success: true,
            message: 'Lấy bài đăng thành công',
            postList: postList
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

module.exports = {
    getInformation,
    getNewPost,
    getNewAdminPost,
    getNewHospitalPost,
    getNewIndividualMilkPost,
    getNewIndividualNoMilkPost,
    getNewOrganizationPost
}