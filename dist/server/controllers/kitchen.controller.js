"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var dao_1 = require("../dao");
function createKitchen(request) {
    if (!request.body.username || !request.body.password || !request.body.name) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    var passwordObject = shared_1.cryptoUtils.hashWithSalt(request.body.password);
    var newUser = {
        username: request.body.username,
        password: passwordObject.password,
        salt: passwordObject.salt,
        role: 'kitchen'
    };
    return dao_1.userDao.insertUser(newUser)
        .then(function (responsedUser) {
        var newKitchen = {
            name: request.body.name,
            userId: responsedUser.id,
            active: true
        };
        return dao_1.kitchenDao.insertKitchen(newKitchen)
            .then(function (responsedKitchen) {
            return Promise.resolve({
                message: 'Create new kitchen successfully.',
                data: {
                    kitchen: responsedKitchen
                }
            });
        })
            .catch(function (error) {
            dao_1.userDao.deleteUser(responsedUser.username).then(function () { }).catch(function () { });
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
function setActiveKitchen(request) {
    return dao_1.kitchenDao.getOriginKitchen(request.query.id)
        .then(function (responsedKitchen) {
        var kitchen = {
            id: request.query.id,
            name: responsedKitchen.name,
            userId: responsedKitchen.userId,
            active: request.query.state
        };
        return dao_1.kitchenDao.updateKitchen(kitchen)
            .then(function (deactivatedKitchen) {
            return Promise.resolve({
                message: 'Deactivate kitchen successfully.',
                data: {
                    kitchen: deactivatedKitchen
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
function getKitchen(request) {
    return dao_1.kitchenDao.getPopulatedKitchenById(request.query.id)
        .then(function (response) { return Promise.resolve({
        message: 'Get kitchen successfully.',
        data: {
            kitchen: response
        }
    }); })
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
function updateKitchen(request) {
    return dao_1.kitchenDao.getOriginKitchen(request.query.id)
        .then(function (responsedKitchen) {
        if (request.body.gender === undefined) {
            request.body.gender = responsedKitchen.gender;
        }
        var kitchen = {
            id: request.query.id,
            name: request.body.name || responsedKitchen.name,
            userId: responsedKitchen.userId,
            active: responsedKitchen.active
        };
        return dao_1.kitchenDao.updateKitchen(kitchen)
            .then(function (updatedKitchen) {
            return Promise.resolve({
                message: 'Update kitchen successfully.',
                data: {
                    kitchen: updatedKitchen
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
function getAllKitchens(request) {
    return dao_1.kitchenDao.getAllKitchens()
        .then(function (response) { return Promise.resolve({
        message: 'Get kitchens successfully.',
        data: {
            kitchens: response
        }
    }); })
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
exports.kitchenController = {
    createKitchen: createKitchen,
    setActiveKitchen: setActiveKitchen,
    getKitchen: getKitchen,
    updateKitchen: updateKitchen,
    getAllKitchens: getAllKitchens
};
//# sourceMappingURL=kitchen.controller.js.map