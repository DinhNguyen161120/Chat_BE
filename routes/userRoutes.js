const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const userControllers = require('../controllers/userController')

router.post('/update-info', auth, userControllers.updateInfo)

module.exports = router;