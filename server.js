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
app.enable('trust proxy');

app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/friend', friendRoutes)
app.use('/conversation', conversationRoutes)
app.use('/file', fileRoutes)

app.get('/', (req, res) => {
    console.log(req.secure)
    let host = process.env.PROTOCOL + req.get('host') + req.originalUrl
    res.send('Hello World!' + host)
})
const Conversation = require('./models/conversation')
app.get('/test-query-limit', async (req, res) => {
    try {
        const conversations = await Conversation.find({
            _id: '65278ee78119ce44cca85af3'
        })
            .populate('participants', 'firstName lastName avatar _id')
            .populate('messages')
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: '_id avatar firstName lastName'
                }
            })
            .populate({
                path: 'messages',
                populate: {
                    path: 'conversation',
                    select: '_id'
                },
                options: {
                    limit: 10,
                    sort: { 'date': -1 },
                }
            })
        res.json(conversations)
    }
    catch (e) {
        console.log(e)
        res.send('err')
    }
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
