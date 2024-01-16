const nodeMailer = require('nodemailer')
const mailerConfig = require('../configs/mailer')
const jwt = require('jsonwebtoken')

let sendMail = ({to, subject, htmlContent}) => {
    const transport = nodeMailer.createTransport({
        host: mailerConfig.HOST,
        port: mailerConfig.PORT,
        secure: false,
        auth: {
            user: mailerConfig.USERNAME,
            pass: mailerConfig.PASSWORD
        }
    })

    const options = {
        from: {
            name: mailerConfig.FROM_NAME,
            address: mailerConfig.FROM_ADDRESS
        },
        to: to,
        subject: subject,
        html: htmlContent
    }

    return transport.sendMail(options)
}

let sendActiveMail = (email, userId) => {
    try {
        const token = jwt.sign(
            {
                id: userId,
                action: 'active'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_ACTIVE_EXPIRED
            }
        )

        sendMail({
            to: email,
            subject: 'KÍCH HOẠT TÀI KHOẢN',
            htmlContent: `
                <h3>Liên kết này sẽ hết hạn trong vòng 5 phút</h3>
                <h1><a href=${`${process.env.FRONT_END_URL}/recovery/${token}`}>Nhấn vào đây để tiếp tục</a></h1>
            `
        })

        return {
            success: true,
            message: 'Gửi email kích hoạt thành công',
        }
    } catch (err) {
        return {
            success: false,
            message: err.message
        }
    }
}

let sendResetMail = (email, userId, password) => {
    try {
        const token = jwt.sign(
            {
                id: userId,
                action: 'password-reset',
                password: password
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_ACTIVE_EXPIRED
            }
        )

        sendMail({
            to: email,
            subject: 'THAY ĐỔI MẬT KHẨU',
            htmlContent: `
                <h3>Liên kết này sẽ hết hạn trong vòng 5 phút</h3>
                <h1><a href=${`${process.env.FRONT_END_URL}/recovery/${token}`}>Nhấn vào đây để tiếp tục</a></h1>
            `
        })

        return {
            success: true,
            message: 'Gửi email kích hoạt thành công',
        }
    } catch (err) {
        return {
            success: false,
            message: err.message
        }
    }
}

module.exports = {
    sendMail,
    sendActiveMail,
    sendResetMail
}