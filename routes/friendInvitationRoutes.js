const express = require('express')
const auth = require('../middleware/auth')

const router = express.Router()

const friendInvitationController = require('../controllers/friendInvitationController')

router.use('/friend-invitation', auth, friendInvitationController.friendInvitation)
router.use('/reject-invitation', auth, friendInvitationController.rejectInvitation)
router.use('/accept-invitation', auth, friendInvitationController.acceptInvitation)

module.exports = router