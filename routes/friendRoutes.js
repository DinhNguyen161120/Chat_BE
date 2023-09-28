const express = require('express')
const auth = require('../middleware/auth')

const router = express.Router()

const friendController = require('../controllers/friendController')

router.use('/friend-invitation', auth, friendController.friendInvitation)
router.use('/reject-invitation', auth, friendController.rejectInvitation)
router.use('/accept-invitation', auth, friendController.acceptInvitation)
router.use('/find', auth, friendController.findFriend)
router.use('/delete', auth, friendController.deleteFriend)

module.exports = router