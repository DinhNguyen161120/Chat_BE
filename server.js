const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
require("dotenv").config();
const socketServer = require("./socketServer");

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.enable("trust proxy");
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// init database
require("./dbs/init.mogodb");

// init router
app.use("/", require("./routes"));

app.use("/api/ci-cd", (req, res, next) => {
    return res.json({
        message: "success",
        name: "CI-CD",
        code: 200,
    });
});

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.statusCode = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    console.log(error.stack);
    return res.status(statusCode).json({
        status: "error",
        stack: error.stack,
        metadata: {
            message: error.message || "Internal Server Error",
            code: error.code || "common_0",
        },
    });
});

const port = process.env.PORT || 3001;
const server = http.createServer(app);
socketServer.registerSocketServer(server);
server.listen(port, () => {
    console.log(`Example server listening on port ${port}`);
});
