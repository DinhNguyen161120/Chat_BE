"use strict";
const { SuccessResponse } = require("../core/success.response");
const FriendService = require("../services/friend.service");
class FriendController {
    findFriend = async (req, res, next) => {
        new SuccessResponse({
            message: "Find friend success!",
            metadata: await FriendService.findFriendByEmail(req.body),
        }).send(res);
    };
    friendInvitation = async (req, res, next) => {
        new SuccessResponse({
            message: "Invitation friend success!",
            metadata: await FriendService.invitation(req.body),
        }).send(res);
    };
    acceptFriend = async (req, res, next) => {
        new SuccessResponse({
            message: "Accept friend success!",
            metadata: await FriendService.accept(req.body),
        }).send(res);
    };
    rejectFriend = async (req, res, next) => {
        new SuccessResponse({
            message: "Reject friend success!",
            metadata: await FriendService.reject(req.body),
        }).send(res);
    };
    deleteFriend = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete friend success!",
            metadata: await FriendService.delete(req.body),
        }).send(res);
    };
}
module.exports = new FriendController();
