

const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const auth = require('../middleware/auth')
const fileController = require('../controllers/fileController')

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
router.post('/upload-avatar', upload.single('avatar'), fileController.uploadAvatar)

const storageImgMessage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imgMessage/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const uploadImgMessage = multer({ storage: storageImgMessage })
router.post('/upload-image-message', uploadImgMessage.single('imgMessage'), fileController.uploadImageMessage)


const storageFile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/file/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const uploadFile = multer({ storage: storageFile })
router.post('/upload-file-message', uploadFile.single('fileMessage'), fileController.uploadFile)

module.exports = router;