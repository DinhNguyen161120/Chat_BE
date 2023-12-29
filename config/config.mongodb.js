"use strict";

const dev = {
    mongo_uri: "mongodb://127.0.0.1:27017/ZALO",
};
const pro = {
    mongo_uri: process.env.MONGO_URI,
};
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
