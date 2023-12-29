"use strict";
const { ConflictRequestError, BadRequestError } = require("../core/error.response");
const { userModel } = require("../models/users.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../utils/auth.utils");
const UserService = require("./user.service");

class AccessService {
    static register = async ({ email, password, firstName, lastName }) => {
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

        if (user) {
            const publicKey = crypto.randomBytes(64).toString("hex");
            const privateKey = crypto.randomBytes(64).toString("hex");
            const tokens = await createTokenPair(
                { userId: user._id, email },
                publicKey,
                privateKey,
            );
            const keyStore = await KeyTokenService.createKeyToken({
                userId: user._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken,
            });
            if (!keyStore) {
                // delete user
                await UserService.deleteUserById({ userId: user._id });
                throw new ConflictRequestError("Server error. please try again!", "common_0");
            }
            return {
                code: "register_2",
                message: "Register successfully!",
                userDetails: user,
                tokens,
            };
        }
    };

    static login = async ({ email, password }) => {
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new ConflictRequestError("Email isn't exist!", "login_0");
        }

        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            throw new ConflictRequestError("Wrong password", "login_1");
        }

        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");
        const tokens = await createTokenPair({ userId: user._id, email }, publicKey, privateKey);
        const keyStore = await KeyTokenService.createKeyToken({
            userId: user._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });
        if (!keyStore) {
            throw new ConflictRequestError("Server error. please try again!", "common_0");
        }
        return {
            code: "login_2",
            message: "Login successfully!",
            userDetails: user,
            tokens,
        };
    };
}

module.exports = AccessService;
