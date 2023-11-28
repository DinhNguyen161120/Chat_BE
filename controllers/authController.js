const userModel = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body
        const accountExit = await userModel.findOne({ email: email.toLowerCase() })
        if (accountExit) {
            // return res.status(409).send('Email đã được sử dụng')
            return res.status(409).json({
                code: 'register_0'
            })
        }
        const encryptPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            email: email.toLowerCase(),
            password: encryptPassword,
            role: 'user',
            firstName: firstName,
            lastName: lastName,
            birthday: new Date(),
            status: '0' // is active
        })
        return res.status(201).json({
            code: 'register_1'
        })
    } catch (err) {
        return res.status(500).json({
            code: 'common_0'
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(409).json({
                code: 'login_0'
            })
        }
        const checkPassword = bcrypt.compareSync(password, user.password)
        if (!checkPassword) {
            return res.status(500).json({
                code: 'login_1'
            })
        }
        const token = jwt.sign(
            {
                email: user.email,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName
            },
            process.env.KEY_TOKEN
            , {
                expiresIn: process.env.EXPIRE_TOKEN
            })
        const userDetails = {
            token: token,
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
            avatar: user.avatar,
            birthday: user.birthday,
            friends: user.friends
        }
        return res.status(200).json({
            code: 'login_2',
            userDetails: userDetails
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            code: 'common_0'
        })
    }
}

const refreshToken = (req, res) => {
    try {
        const { userDetails } = req.body
        userDetails.token = '1234'
        const token = jwt.sign(
            {
                ...userDetails
            },
            process.env.KEY_TOKEN
            , {
                expiresIn: process.env.EXPIRE_TOKEN
            })
        const newUserDetails = {
            ...userDetails,
            token: token
        }
        return res.status(201).json({ userDetails: newUserDetails })
    } catch (err) {
        console.log(err, 'refresh token')
        return res.status(500).send('Error on server')
    }
}

module.exports = {
    register, login, refreshToken
}