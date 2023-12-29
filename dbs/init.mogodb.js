"use strict";
const mongoose = require("mongoose");
// const { db: { host, port, name } } = require('../configs/config.mongodb.js')
const { mongo_uri } = require("../config/config.mongodb");
// const { countConnect } = require('../helpers/check.connect')

const connectString = mongo_uri;
console.log(connectString);
class Database {
    constructor() {
        this.connect();
    }

    connect() {
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }
        mongoose
            .connect(connectString)
            .then((_) =>
                console.log(
                    "connect MongoDB success", //, countConnect()
                ),
            )
            .catch((err) => console.log("Connect MongoDB failed"));
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
