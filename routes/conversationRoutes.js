const express = require('express')
const auth = require('../middleware/auth')

const router = express.Router()

const conversationController = require('../controllers/conversationController')

router.post('/create', auth, conversationController.createNewConversation)

module.exports = router