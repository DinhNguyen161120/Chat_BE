"use strict";
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

class ConflictRequestError extends Error {
    constructor(message = ReasonPhrases.CONFLICT, code = "", statusCode = StatusCodes.CONFLICT) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
class BadRequestError extends Error {
    constructor(
        message = ReasonPhrases.BAD_REQUEST,
        code = "",
        statusCode = StatusCodes.BAD_REQUEST,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
};
