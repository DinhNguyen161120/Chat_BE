
const User = require('../models/users')


const updateInfo = async (req, res) => {
    try {
        const userDetails = req.body
        let user = await User.findById(userDetails._id)
        user.firstName = userDetails.firstName
        user.lastName = userDetails.lastName
        user.avatar = userDetails.avatar
        user.birthday = userDetails.birthday
        user.sex = userDetails.sex

        await user.save()

        return res.status(200).send('Update success')
    } catch (err) {
        console.log(err)
        return res.status(405).send('Update failed')
    }
}

module.exports = {
    updateInfo
}