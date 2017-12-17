"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var dao_1 = require("../dao");
var models_1 = require("../models");
var config_1 = require("../config");
function login(request) {
    if (!request.body.username || !request.body.password) {
        var error = {
            statusCode: 400,
            message: 'Data fields missing.'
        };
        return Promise.reject(error);
    }
    if (request.body.username === config_1.default.admin.username &&
        request.body.password === config_1.default.admin.password) {
        var tokenObject_1 = {
            role: 'admin',
            username: 'admin'
        };
        var promise = new Promise(function (resolve, reject) {
            shared_1.tokenSign(tokenObject_1, function (err, token) {
                if (!err) {
                    resolve({
                        message: 'Login successfully.',
                        data: {
                            token: token
                        }
                    });
                }
                else {
                    reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
            });
        });
        return promise;
    }
    return dao_1.userDao.checkPassword(request.body.username, request.body.password)
        .then(function (flag) {
        if (flag) {
            return dao_1.userDao.getUser(request.body.username)
                .then(function (user) {
                if (user.role === 'staff') {
                    return dao_1.staffDao.getPopulatedStaffByUserId(user.id)
                        .then(function (staff) {
                        if (staff.active === false) {
                            return Promise.reject({
                                statusCode: 400,
                                message: 'Wrong username or password.'
                            });
                        }
                        staff.role = 'staff';
                        staff._id = staff.id;
                        var tokenObject = {
                            role: 'staff',
                            userId: user.id,
                            staff: staff
                        };
                        var promise = new Promise(function (resolve, reject) {
                            shared_1.tokenSign(tokenObject, function (err, token) {
                                if (!err) {
                                    resolve({
                                        message: 'Login successfully.',
                                        data: {
                                            token: token
                                        }
                                    });
                                }
                                else {
                                    reject({
                                        statusCode: 500,
                                        message: 'Internal server error.'
                                    });
                                }
                            });
                        });
                        return promise;
                    })
                        .catch(function (error) {
                        return Promise.reject(error);
                    });
                }
                else if (user.role === 'kitchen') {
                    return dao_1.kitchenDao.getPopulatedKitchenByUserId(user.id)
                        .then(function (kitchen) {
                        if (kitchen.active === false) {
                            return Promise.reject({
                                statusCode: 400,
                                message: 'Wrong username or password.'
                            });
                        }
                        kitchen.role = 'kitchen';
                        kitchen._id = kitchen.id;
                        var tokenObject = {
                            role: 'kitchen',
                            userId: user.id,
                            kitchen: kitchen
                        };
                        var promise = new Promise(function (resolve, reject) {
                            shared_1.tokenSign(tokenObject, function (err, token) {
                                if (!err) {
                                    resolve({
                                        message: 'Login successfully.',
                                        data: {
                                            token: token
                                        }
                                    });
                                }
                                else {
                                    console.log(4);
                                    reject({
                                        statusCode: 500,
                                        message: 'Internal server error.'
                                    });
                                }
                            });
                        });
                        return promise;
                    })
                        .catch(function (error) { return Promise.reject(error); });
                }
            })
                .catch(function (error) { return Promise.reject(error); });
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Wrong username or password.'
            });
        }
    })
        .catch(function (error) { return Promise.reject(error); });
}
function tableLogin(request) {
    return models_1.TableModel.findOne({ name: request.body.name })
        .then(function (table) {
        if (table) {
            if (table.active === false) {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Wrong table id.'
                });
            }
            if (table.status !== 'available') {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Table not available.'
                });
            }
            var tokenObject_2 = {
                role: 'table',
                name: table.name,
                _id: table.id
            };
            var promise = new Promise(function (resolve, reject) {
                shared_1.tokenSign(tokenObject_2, function (err, token) {
                    if (!err) {
                        table.status = 'serving';
                        console.log(table);
                        dao_1.tableDao.updateTable(table).catch(function (error) { return console.log(error); });
                        resolve({
                            message: 'Login successfully.',
                            data: {
                                table: table,
                                token: token
                            }
                        });
                    }
                    else {
                        reject({
                            statusCode: 500,
                            message: 'Internal server error.'
                        });
                    }
                });
            });
            return promise;
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Wrong table id.'
            });
        }
    })
        .catch(function (error) { return Promise.reject(error); });
}
exports.authController = {
    login: login,
    tableLogin: tableLogin
};
//# sourceMappingURL=auth.controller.js.map