const jwt = require('jsonwebtoken')

const refreshToken = (userDetails) => {
    try {
        const newToken = jwt.sign(
            {
                ...userDetails
            },
            process.env.KEY_TOKEN
            , {
                expiresIn: process.env.EXPIRE_TOKEN
            })
        return newToken
    } catch (e) {
        console.log(e)
    }
}

module.exports = refreshToken;