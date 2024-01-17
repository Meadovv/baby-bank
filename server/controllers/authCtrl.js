const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {
    sendActiveMail,
    sendResetMail
} = require('./mailerCtrl')

const {
    createNotification
} = require('./notificationCtrl')

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

        if (!user.active && user.updated) {
            return res.status(200).send({
                success: false,
                message: 'Tài khoản đã bị hủy kích hoạt'
            })
        }

        if (!user.active && !user.updated) {
            return res.status(200).send({
                success: false,
                message: 'Kích hoạt tài khoản trong email'
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
        const user = await userModel.findOne({
            username: req.body.user.email
        })

        if (user) {
            return res.status(200).send({
                success: false,
                message: 'Email đã tồn tại'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.user.password, salt);

        const newUser = new userModel({
            active: false,// active
            updated: false,
            name: req.body.user.name,
            username: req.body.user.email,
            password: hashedPassword,
            mode: req.body.user.mode,
            location: {
                address: 'Chưa cập nhật',
                lat: 0,
                lng: 0,
                private: false
            },
            email: {
                value: req.body.user.email,
                private: false
            },
            phone: {
                value: 'Chưa cập nhật',
                private: false
            },
            createDate: Date.now()
        })

        await newUser.save()

        const result = sendActiveMail(newUser.email.value, newUser._id)
        if (result.success) {
            res.status(200).send({
                success: true,
                message: 'Đăng ký thành công. Kích hoạt tài khoản trong email'
            })
        } else {
            res.status(200).send({
                success: false,
                message: result.message
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).send({
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
                if (user.phone.private) user.phone.value = "Không công khai"
                if (user.email.private) user.email.value = "Không công khai"
                if (user.location.private) user.location.address = "Không công khai"
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

let updateLocation = async (req, res) => {
    await userModel.findById({
        _id: req.body.userId
    }).then(async user => {
        if(user) {
            user.location.lat = req.body.lat
            user.location.lng = req.body.lng

            await user.save()

            res.status(200).send({
                success: true,
                message: 'Cập nhật tọa độ thành công'
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

let updateUser = async (req, res) => {
    await userModel.findById({
        _id: req.body.userId
    }).then(async user => {
        if (user) {
            if (req.body.field === 'email') {
                if (req.body.data.type === 'value') {
                    user.email.value = req.body.data.value
                } else {
                    user.email.private = req.body.data.value === 'private' ? true : false
                }
            }

            if (req.body.field === 'phone') {
                if (req.body.data.type === 'value') {
                    user.phone.value = req.body.data.value
                } else {
                    user.phone.private = req.body.data.value === 'private' ? true : false
                }
            }

            if (req.body.field === 'address') {
                if (req.body.data.type === 'value') {
                    user.location.address = req.body.data.value
                } else {
                    user.location.private = req.body.data.value === 'private' ? true : false
                }
            }

            if (req.body.field === 'password') {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.data.value, salt);
                user.password = hashedPassword
            }

            await user.save()

            res.status(200).send({
                success: true,
                message: 'Cập nhật thành công'
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

const recovery = async (req, res) => {
    try {
        const token = req.params.token
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(200).send({
                    success: false,
                    message: err.message
                })
            } else {
                userModel.findById({
                    _id: decode.id
                }).then(async user => {
                    if (user) {
                        if (decode.action === 'active') {
                            user.active = true
                            await user.save()
                            return res.status(200).send({
                                success: true,
                                message: 'Kích hoạt thành công',
                            })
                        }

                        if (decode.action === 'password-reset') {
                            const salt = await bcrypt.genSalt(10);
                            const hashedPassword = await bcrypt.hash(decode.password, salt);
                            user.password = hashedPassword
                            user.active = true
                            await user.save()
                            return res.status(200).send({
                                success: true,
                                message: 'Thay đổi mật khẩu thành công',
                            })
                        }

                        return res.status(200).send({
                            success: false,
                            message: 'Hành động sai'
                        })
                    } else {
                        return res.status(200).send({
                            success: false,
                            message: 'Không tìm thấy người dùng'
                        })
                    }
                }).catch(err => {
                    return res.status(500).send({
                        success: false,
                        message: err.message
                    })
                })
            }
        })
    } catch (err) {
        console.log(err)
        res.status(401).send({
            success: false,
            message: `Authentication Failed`
        })
    }
}

const forgot = async (req, res) => {
    try {
        const user = await userModel.findOne({
            username: req.body.email
        })

        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'Email không tồn tại'
            })
        }

        const result = sendResetMail(user.email.value, user._id, req.body.password)
        if (result.success) {
            res.status(200).send({
                success: true,
                message: 'Gửi email thành công'
            })
        } else {
            res.status(200).send({
                success: false,
                message: result.message
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

const calling = async (req, res) => {
    let userRadianLat = 0
    let userRadianLng = 0

    try {
        userRadianLat = req.body.location.lat * 0.01745329252
        userRadianLng = req.body.location.lng * 0.01745329252
    } catch (err) {
        userRadianLat = 0
        userRadianLng = 0
    }
    try {
        const userList = await userModel.find()
        let userCount = 0
        userList.forEach(async user => {
            const lat = user.location.lat * 0.01745329252
            const lng = user.location.lng * 0.01745329252
            const distance = 
                Math.round((6378 * Math.acos(Math.sin(userRadianLat) * Math.sin(lat) + Math.cos(userRadianLat) * Math.cos(lat) * Math.cos(lng - userRadianLng))))

            if(Number(req.body.data.distance) !== 0 && distance > Number(req.body.data.distance)) return
            if(user.mode !== 'individual') return

            userCount = userCount + 1
            await createNotification({
                owner: user._id,
                appointmentId: null,
                message: req.body.data.note,
                link: `/profile/${req.body.userId}`
            })
        })

        res.status(200).send({
            success: true,
            message: `Đã gửi thông báo cho ${userCount} người`
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
    loginController,
    registerController,
    updateUser,
    updateLocation,
    getUserData,
    getProfileData,
    recovery,
    forgot,
    calling
}