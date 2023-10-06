const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const os = require('os')
const url = require('url')
require('dotenv').config()
const socketServer = require('./socketServer')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const friendRoutes = require('./routes/friendRoutes')
const conversationRoutes = require('./routes/conversationRoutes')
const fileRoutes = require('./routes/fileRouter')

const port = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/friend', friendRoutes)
app.use('/conversation', conversationRoutes)
app.use('/file', fileRoutes)

app.get('/', (req, res) => {
    let host = req.protocol + '://' + req.get('host') + req.originalUrl
    res.send('Hello World!' + host)
})

const server = http.createServer(app)

socketServer.registerSocketServer(server)

mongoose.connect(process.env.MONGO_DEV)
    .then(() => {
        server.listen(port, () => {
            console.log(`Example server listening on port ${port}`)
        })
    })
    .catch((err) => {
        console.log('connect database failed', err)
    })
