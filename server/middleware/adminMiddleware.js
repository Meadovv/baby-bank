const jwt = require('jsonwebtoken')

let adminMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(200).send({
                    success: false,
                    message: 'Authentication Failed'
                })
            } else {
                if(decode.mode !== 'admin') {
                    return res.status(200).send({
                        success: false,
                        message: 'Authentication Failed'
                    })
                } else {
                    req.body.userId = decode.id
                    req.body.userRole = decode.mode
                    next()
                }
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

module.exports = {
    adminMiddleware,
}