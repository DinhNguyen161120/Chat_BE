"use strict";
const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
    updateInformation = async (req, res, next) => {
        console.log(req.body);
        new SuccessResponse({
            message: "Update info success!",
            metadata: await UserService.updateInformation(req.body),
        }).send(res);
    };
}
module.exports = new UserController();
