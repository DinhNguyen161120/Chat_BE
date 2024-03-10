const userModel = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    refreshToken = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.refreshToken(req.body),
        }).send(res);
    };
}

module.exports = new AccessController();
