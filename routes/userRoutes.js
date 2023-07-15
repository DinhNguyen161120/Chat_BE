const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const auth = require('../middleware/auth')

const userControllers = require('../controllers/userController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatar/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })
router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    try {
        const { destination, filename } = req.file
        const pathAvatar = '/' + destination + filename
        return res.status(200).json({
            avatar: pathAvatar
        })
    } catch (err) {
        return res.status(405).send('Upload failed')
    }
})

router.post('/update-info', auth, userControllers.updateInfo)


module.exports = router;