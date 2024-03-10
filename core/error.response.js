"use strict";
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

class ConflictRequestError extends Error {
    constructor(message = ReasonPhrases.CONFLICT, code = "", statusCode = StatusCodes.CONFLICT) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
class ForbiddenError extends Error {
    constructor(message = ReasonPhrases.FORBIDDEN, code = "", statusCode = StatusCodes.FORBIDDEN) {
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
    ForbiddenError,
};
