const { userModel } = require("../models/users.model");
class UserService {
    static deleteUserById = async ({ userId }) => {
        await userModel.findByIdAndDelete({ _id: userId });
    };

    static updateInformation = async ({ userDetails }) => {
        await userModel.updateOne(
            { _id: userDetails._id },
            {
                $set: {
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    avatar: userDetails.avatar,
                    birthday: userDetails.birthday,
                    gender: userDetails.gender,
                },
            },
        );
        return { message: "Update information success", code: "update_information_0" };
    };
}

module.exports = UserService;
