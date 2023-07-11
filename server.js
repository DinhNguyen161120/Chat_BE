const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
require('dotenv').config()
const socketServer = require('./socketServer')

const authRoutes = require('./routes/authRoutes')

const port = process.env.PORT

app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const server = http.createServer(app)

socketServer.registerSocketServer(server)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(port, () => {
            console.log(`Example server listening on port ${port}`)
        })
    })
    .catch((err) => {
        console.log('connect database failed')
    })
