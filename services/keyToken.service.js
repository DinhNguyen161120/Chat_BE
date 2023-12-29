"use strict";
const { keyTokenModel } = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId };
            const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
            const options = { upsert: true, new: true };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
    static getPrivateKeyFromUserId = async ({ userId }) => {
        try {
            const tokens = await keyTokenModel.findOne({ user: userId });
            return tokens ? tokens.privateKey : null;
        } catch (error) {
            return error;
        }
    };
    static getPublicKeyFromUserId = async ({ userId }) => {
        try {
            const tokens = await keyTokenModel.findOne({ user: userId });
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}
module.exports = KeyTokenService;
