const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.token
        const decoded = jwt.verify(token, process.env.KEY_TOKEN)
    } catch (err) {
        console.log(err, 'auth.js')
        return res.status(403).send("Invalid Token")
    }
    next()
}

module.exports = verifyToken;