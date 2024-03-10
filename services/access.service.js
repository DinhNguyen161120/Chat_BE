"use strict";
const { ConflictRequestError, BadRequestError, ForbiddenError } = require("../core/error.response");
const { userModel } = require("../models/users.model");
const bcrypt = require("bcryptjs");
const { createTokenPair } = require("../utils/auth.utils");
const jwt = require("jsonwebtoken");
const socketStore = require("../socketStore");
class AccessService {
    static register = async ({ email, password, firstName, lastName }) => {
        const emailRegex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let checkEmail = emailRegex.test(email);
        if (!checkEmail) {
            throw new ConflictRequestError("Invalid email", "invalid_email");
        }

        const emailExit = await userModel.findOne({ email: email.toLowerCase() });
        if (emailExit) {
            throw new ConflictRequestError("Email already exists", "register_0");
        }
        const encryptPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            email: email.toLowerCase(),
            password: encryptPassword,
            firstName: firstName,
            lastName: lastName,
        });

        if (!user) throw new BadRequestError("Register failed!", "register_1");

        user.password = "";
        let tokens = await createTokenPair({
            userId: user._id,
            email: email.toLowerCase(),
        });

        await userModel.updateOne(
            { _id: user._id },
            {
                $set: {
                    refreshToken: tokens.refreshToken,
                },
            },
        );

        return {
            code: "register_2",
            message: "Register successfully!",
            userDetails: user,
            tokens,
        };
    };

    static login = async ({ email, password }) => {
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new ConflictRequestError("Email isn't exist!", "login_0");
        }

        let userConnected = socketStore.checkUserOnline(user._id.toString());
        if (userConnected) {
            let io = socketStore.getInstantSocket();
            let socketId = socketStore.getSocketIdFromUserId(user._id.toString());
            io.to(socketId).emit("logout");
        }

        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            throw new ConflictRequestError("Wrong password", "login_1");
        }
        let tokens = await createTokenPair({
            userId: user._id,
            email: email.toLowerCase(),
        });
        user.password = "";
        await userModel.updateOne(
            { _id: user._id },
            {
                $set: {
                    refreshToken: tokens.refreshToken,
                },
            },
        );
        return {
            code: "login_2",
            message: "Login successfully!",
            userDetails: user,
            tokens,
        };
    };

    static refreshToken = async ({ refreshToken, userId, email }) => {
        let user = await userModel.findOne({ _id: userId });

        if (!user) throw new ConflictRequestError("user not found", "user_not_found");

        if (user.refreshTokensUsed.includes(refreshToken))
            throw new ForbiddenError("Something wrong happen. Please re-login");

        if (user.refreshToken !== refreshToken)
            throw new ForbiddenError("Authorization failed, please login again", "re_login");

        let tokens = await createTokenPair({
            userId: userId,
            email: email.toLowerCase(),
        });

        // update token in dbs
        await userModel.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken, // token used
            },
        });

        return {
            tokens,
        };
    };
}

module.exports = AccessService;
