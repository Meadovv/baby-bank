const nodeMailer = require('nodemailer')
const mailerConfig = require('../configs/mailer')

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

module.exports = {
    sendMail
}