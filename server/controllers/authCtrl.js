const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verifyModel = require('../models/verifyModel')

const {
    sendMail
} = require('./mailerCtrl')

const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({
            username: req.body.username
        })

        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'Tên người dùng hoặc mật khẩu không đúng'
            })
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: 'Tên người dùng hoặc mật khẩu không đúng'
            })
        }

        if (!user.active) {
            return res.status(200).send({
                success: false,
                message: 'Tài khoản đã bị hủy kích hoạt'
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                mode: user.mode
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRED
            }
        )

        res.status(200).send({
            success: true,
            message: "Đăng nhập thành công",
            token: token
        })

    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: `Error in Login Controller ${err.message}`
        })
    }
}

const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({
            username: req.body.username
        })

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Email đã tồn tại'
            })
        }

        const verifyCode = await verifyModel.findOne({
            owner: req.body.username
        })

        if(verifyCode) {

            if(verifyCode.code !== Number(req.body.verifyCode)) {
                return res.status(200).send({
                    success: false,
                    message: 'Mã xác nhận sai'
                })
            }

            await verifyModel.deleteMany({
                owner: req.body.username
            })

            if(verifyCode.expired < Date.now()) {
                return res.status(200).send({
                    success: false,
                    message: 'Mã xác nhận đã hết hạn. Hãy gửi lại mã mới'
                })
            }
        } else {
            return res.status(200).send({
                success: false,
                message: 'Mã xác nhận sai'
            })
        }

        // Hash code password
        const password = req.body.password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        const newUser = new userModel({
            active: true,
            updated: false,
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            mode: req.body.mode,
            location: {
                address: 'Chưa cập nhật',
                lat: 0,
                lng: 0,
                private: true,
            },
            email: {
                value: req.body.username,
                private: true
            },
            phone: {
                value: 'Chưa cập nhật',
                private: true
            },
            createDate: Date.now()
        });

        await newUser.save()

        res.status(201).send({
            success: true,
            message: `Đăng ký thành công`
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: `Error in Register Controller ${err.message}`
        })
    }
}

const getUserData = async (req, res) => {
    try {
        const user = await userModel.findById({
            _id: req.body.userId
        })

        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'user not found'
            })
        }

        user.password = null
        return res.status(200).send({
            success: true,
            user: user
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: 'Authentication Failed',
            error: err
        })
    }
}

const getProfileData = async (req, res) => {
    await userModel.findById({
        _id: req.body.user
    }).then(user => {
        if (user) {
            user.password = null
            if (req.body.user === req.body.userId) {
                res.status(200).send({
                    success: true,
                    user: user
                })
            } else {
                if(user.phone.private) user.phone.value = "Không công khai"
                if(user.email.private) user.email.value = "Không công khai"
                if(user.location.private) user.location.address = "Không công khai"
                res.status(200).send({
                    success: true,
                    user: user
                })
            }
        } else {
            res.status(200).send({
                success: false,
                message: 'Không tìm thấy user'
            })
        }
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

let updateUser = async (req, res) => {
    console.log(req.body)
    await userModel.findById({
        _id: req.body.userId
    }).then(async (user) => {
        if(user) {

            user.updated = true

            user.phone.value = req.body.value.phone
            user.phone.private = req.body.value.phoneStatus === 'private'

            user.location.address = req.body.value.address
            user.location.lat = req.body.value.lat
            user.location.lng = req.body.value.lng
            user.location.private = req.body.value.addressStatus === 'private'

            user.email.value = req.body.value.email
            user.email.private = req.body.value.emailStatus === 'private'

            await user.save()

            res.status(200).send({
                success: true,
                message: 'Cập nhật thông tin thành công'
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Không tìm thấy người dùng'
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

let changePassword = async (req, res) => {

    await userModel.findById({
        _id: req.body.userId
    }).then(async (user) => {
        const isMatch = await bcrypt.compare(req.body.old, user.password)
        if (isMatch) {
            if (req.body.new === req.body.confirm) {
                if (req.body.new.length < 8) {
                    res.status(200).send({
                        success: false,
                        message: 'Độ dài mật khẩu phải lớn hơn 8'
                    })
                } else {
                    const password = req.body.new
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);

                    user.password = hashedPassword

                    await user.save()

                    res.status(200).send({
                        success: true,
                        message: 'Đổi mật khẩu thành công'
                    })
                }
            } else {
                res.status(200).send({
                    success: false,
                    message: 'Mật khẩu không trùng khớp'
                })
            }
        } else {
            res.status(200).send({
                success: false,
                message: 'Mật khẩu cũ không đúng'
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

let sendVerifyCode = async (req, res) => {
    try {

        const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        await verifyModel.deleteMany({
            owner: req.body.email
        })
        const newVerify = new verifyModel({
            owner: req.body.email,
            code: verifyCode,
            expired: Date.now() + 5 * 60 * 1000
        })

        await newVerify.save()


        sendMail({
            to: req.body.email,
            subject: 'XÁC NHẬN TÀI KHOẢN',
            htmlContent: `<h3>Mã xác nhận này sẽ hết hạn trong vòng 5 phút</h3><h1>${verifyCode}</h1>`
        })
    
        res.status(200).send({
            success: true,
            message: 'Kiểm tra mã trong Email. Mã sẽ hết hạn trong vòng 5 phút'
        })
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    loginController,
    registerController,
    updateUser,
    getUserData,
    getProfileData,
    changePassword,
    sendVerifyCode
}