const express = require('express')
const auth = require('../middleware/auth')

const router = express.Router()

const conversationController = require('../controllers/conversationController')

router.post('/create-with-message', auth, conversationController.createNewConversation)
router.post('/create-without-message', auth, conversationController.createConversationWithMessage)
router.delete('/delete', auth, conversationController.deleteConversation)
router.post('/group', auth, conversationController.createNewConversationGroup)

module.exports = router