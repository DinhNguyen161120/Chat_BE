const jwt = require('jsonwebtoken')

const refreshToken = (userDetails) => {
    const newToken = jwt.sign(
        {
            ...userDetails
        },
        process.env.KEY_TOKEN
        , {
            expiresIn: process.env.EXPIRE_TOKEN
        })
    return newToken
}

module.exports = refreshToken;