"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var dao_1 = require("../dao");
function changePassword(request) {
    if (!request.body.oldPassword || !request.body.newPassword) {
        var error = {
            statusCode: 400,
            message: 'Data fields missing.'
        };
        return Promise.reject(error);
    }
    else {
        return dao_1.userDao.getSalt(request.body.username)
            .then(function (salt) {
            return dao_1.userDao.checkPassword(request.body.username, request.body.oldPassword)
                .then(function (response) {
                if (response === true) {
                    return dao_1.userDao.updatePassword(request.body.username, shared_1.cryptoUtils.hashWithSalt(request.body.newPassword))
                        .then(function () { return Promise.resolve({
                        message: 'Password changed successfully',
                        data: {}
                    }); })
                        .catch(function (error) { return Promise.reject(error); });
                }
                else {
                    return Promise.reject({
                        statusCode: 404,
                        message: 'Wrong password.'
                    });
                }
            })
                .catch(function (error) {
                if (!error.statusCode) {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
                else {
                    return Promise.reject(error);
                }
            });
        })
            .catch(function (error) {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    }
}
exports.userController = {
    changePassword: changePassword
};
//# sourceMappingURL=user.controller.js.map