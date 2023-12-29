const { ConflictRequestError } = require("../core/error.response");
const { userModel } = require("../models/users.model");
const { invitationModel } = require("../models/friendInvitation.model");
const { updatePendingInvitation, updateListFriends } = require("../socketHandle/update/friend");
const { conversationModel } = require("../models/conversation.model");
const { messageModel } = require("../models/message.model");
const {
    updateFriendsInUserDetails,
    updateFriendsInUserDetailsUseListFriendParameter,
} = require("../socketHandle/update/user");
const { updateConversation } = require("../socketHandle/update/conversation");

class FriendService {
    static findFriendByEmail = async ({ email }) => {
        const user = await userModel
            .findOne({ email: email })
            .select({
                password: 0,
                __v: 0,
            })
            .lean();
        if (!user) {
            throw new ConflictRequestError("User not found", "findFriend_0");
        }
        return {
            message: "Find friend success",
            code: "findFriend_1",
            userData: user,
        };
    };

    static invitation = async ({ senderId, receiverId }) => {
        const invitationExist = await invitationModel.findOne({
            sender: senderId,
            receiver: receiverId,
        });

        if (invitationExist) {
            throw new ConflictRequestError(
                "You have sent a friend request before",
                "friendInvitation_0",
            );
        }

        const invitationExist2 = await invitationModel.findOne({
            sender: receiverId,
            receiver: senderId,
        });

        if (invitationExist2) {
            throw new ConflictRequestError(
                "You have received a friend request from this person before",
                "friendInvitation_1",
            );
        }

        await invitationModel.create({
            sender: senderId,
            receiver: receiverId,
            date: new Date(),
        });
        updatePendingInvitation(receiverId.toString());
        return {
            code: "friendInvitation_2",
        };
    };
    static accept = async ({ invitationId }) => {
        const invitation = await invitationModel.findByIdAndDelete(invitationId);
        const { sender, receiver } = invitation;

        await userModel.updateOne({ _id: sender }, { $push: { friends: receiver } });

        await userModel.updateOne({ _id: receiver }, { $push: { friends: sender } });

        let conversation = await conversationModel.findOne({
            $or: [{ participants: [sender, receiver] }, { participants: [receiver, sender] }],
        });
        if (conversation && conversation.participants.length == 2) {
            const newMessage = await messageModel.create({
                sender: sender,
                conversation: conversation._id,
                type: "accept_friend",
                date: new Date(),
                status: "2", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            });

            conversation.messages.push(newMessage._id);
            await conversation.save();
        } else {
            const firstConversation = await conversationModel.create({
                participants: [sender, receiver],
                messages: [],
                date: new Date(),
            });
            const firstMessage = await messageModel.create({
                sender: sender,
                type: "accept_friend",
                date: new Date(),
                status: "2", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            });
            firstConversation.messages.push(firstMessage._id);
            firstConversation.save();
        }
        updatePendingInvitation(receiver.toString());
        updateListFriends(receiver.toString());
        updateListFriends(sender.toString());

        // update usedetails
        updateFriendsInUserDetails(sender.toString());
        updateFriendsInUserDetails(receiver.toString());

        // update conversation
        updateConversation(sender.toString());
        updateConversation(receiver.toString());
        return {
            code: "accept_friend_0",
        };
    };

    static reject = async ({ invitationId, receiverId }) => {
        await invitationModel.findByIdAndDelete(invitationId);
        updatePendingInvitation(receiverId.toString());
        return {
            message: "Reject friend successfully!",
            code: "reject_0",
        };
    };
    static delete = async ({ userId, friendId }) => {
        let user = await userModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { friends: friendId } },
            { upsert: true, new: true },
        );

        let friend = await userModel.findOneAndUpdate(
            { _id: friendId },
            { $pull: { friends: userId } },
            { upsert: true, new: true },
        );

        // update listfriend
        updateFriendsInUserDetailsUseListFriendParameter(userId, user.friends);
        updateFriendsInUserDetailsUseListFriendParameter(friendId, friend.friends);
        updateListFriends(userId);
        updateListFriends(friendId);

        return {
            message: "Delete friend success!",
            code: "deleteFriend_0",
        };
    };
}

module.exports = FriendService;
