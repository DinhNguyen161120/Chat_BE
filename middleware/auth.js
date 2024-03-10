const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.KEY_TOKEN);
        console.log(decoded);
        next();
    } catch (err) {
        console.log(err, "auth.js");
        return res.status(403).send("Invalid Token");
    }
};

module.exports = {
    verifyToken,
};
