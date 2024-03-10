const JWT = require("jsonwebtoken");

const createTokenPair = async (payload) => {
    try {
        const accessToken = await JWT.sign(payload, process.env.KEY_TOKEN, {
            expiresIn: process.env.EXPIRE_TOKEN,
        });
        const refreshToken = await JWT.sign(payload, process.env.KEY_REFRESH_TOKEN, {
            expiresIn: process.env.EXPIRE_REFRESH_TOKEN,
        });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    createTokenPair,
};
