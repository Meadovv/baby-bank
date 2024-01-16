const userModel = require('../models/userModel')
const postModel = require('../models/postModel')

const getNewPost = async (req, res) => {
    await postModel.find({
        active: true
    }).limit(6).sort({ createDate: -1 })
        .then(posts => {
            let postList = []

            posts.forEach(post => {
                post.images = []
                if(post.title === null) post.title = 'Bài đăng không có tiêu đề'
                postList.push(post)
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
        hashTag: 'admin',
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            post.images = []
            if(post.title === null) post.title = 'Bài đăng không có tiêu đề'
            postList.push(post)
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
        ownerMode: 'individual',
        hashTag: 'milk',
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            post.images = []
            if(post.title === null) post.title = 'Bài đăng không có tiêu đề'
            postList.push(post)
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
        ownerMode: 'individual',
        hashTag: 'no-milk',
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            post.images = []
            if(post.title === null) post.title = 'Bài đăng không có tiêu đề'
            postList.push(post)
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
        ownerMode: 'organization',
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            post.images = []
            if(post.title === null) post.title = 'Bài đăng không có tiêu đề'
            postList.push(post)
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
        ownerMode: 'hospital',
        active: true
    }).limit(6).sort({ createDate: -1 })
    .then(posts => {
        let postList = []

        posts.forEach(post => {
            post.images = []
            if(post.title === null) post.title = 'Bài đăng không có tiêu đề'
            postList.push(post)
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
    getNewPost,
    getNewAdminPost,
    getNewHospitalPost,
    getNewIndividualMilkPost,
    getNewIndividualNoMilkPost,
    getNewOrganizationPost
}