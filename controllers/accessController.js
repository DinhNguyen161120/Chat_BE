const userModel = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ConflictRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    register = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.register(req.body),
        }).send(res);
    };
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res);
    };
}

const refreshToken = (req, res) => {
    try {
        const { userDetails } = req.body;
        userDetails.token = "1234";
        const token = jwt.sign(
            {
                ...userDetails,
            },
            process.env.KEY_TOKEN,
            {
                expiresIn: process.env.EXPIRE_TOKEN,
            },
        );
        const newUserDetails = {
            ...userDetails,
            token: token,
        };
        return res.status(201).json({ userDetails: newUserDetails });
    } catch (err) {
        console.log(err, "refresh token");
        return res.status(500).send("Error on server");
    }
};

module.exports = new AccessController();
