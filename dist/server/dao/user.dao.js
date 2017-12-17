"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var shared_1 = require("../shared");
function getSalt(username) {
    return models_1.UserModel.findOne({ username: username })
        .then(function (responsedUser) {
        if (responsedUser) {
            return Promise.resolve(responsedUser.salt);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'User does not exist.'
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
}
function checkPassword(username, password) {
    return getSalt(username)
        .then(function (salt) {
        var hashPassword = shared_1.cryptoUtils.hashWithSalt(password, salt).password;
        return models_1.UserModel.findOne({ username: username })
            .then(function (responsedUser) { return Promise.resolve(responsedUser.password === hashPassword); })
            .catch(function (error) { return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        }); });
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
function updatePassword(username, _a) {
    var password = _a.password, salt = _a.salt;
    return models_1.UserModel.findOne({ username: username })
        .then(function (responsedUser) {
        responsedUser.password = password;
        responsedUser.salt = salt;
        return updateUser(responsedUser)
            .then(function () { return Promise.resolve(); })
            .catch(function (error) { return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        }); });
    })
        .catch(function (error) { return Promise.reject({
        statusCode: 500,
        message: 'Internal server error.'
    }); });
}
function updateUser(user) {
    var updatedUser = new models_1.UserModel(user);
    return updatedUser.save()
        .then(function (responsedUser) { return Promise.resolve(responsedUser); })
        .catch(function (error) { return Promise.reject({
        statusCode: 500,
        message: 'Internal server error.'
    }); });
}
function insertUser(user) {
    return models_1.UserModel.findOne({ username: user.username })
        .then(function (responsedUser) {
        if (responsedUser) {
            return Promise.reject({
                statusCode: 400,
                message: 'User already exist.'
            });
        }
        else {
            var newUser = new models_1.UserModel(user);
            return newUser.save()
                .then(function (savedUser) { return Promise.resolve(savedUser); })
                .catch(function (err) { return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            }); });
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
}
function deleteUser(username) {
    return models_1.UserModel.findOneAndRemove({ username: username })
        .then(function () {
        return Promise.resolve('Delete user successfully.');
    })
        .catch(function () {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getUser(username) {
    return models_1.UserModel.findOne({ username: username })
        .then(function (user) {
        if (user) {
            return Promise.resolve(user);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'User not found.'
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
}
exports.userDao = {
    updateUser: updateUser,
    insertUser: insertUser,
    getSalt: getSalt,
    checkPassword: checkPassword,
    updatePassword: updatePassword,
    deleteUser: deleteUser,
    getUser: getUser
};
//# sourceMappingURL=user.dao.js.map