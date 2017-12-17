"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var shared_1 = require("../shared");
function convertKitchenToResponseObject(kitchen) {
    return {
        name: kitchen.name,
        lowercaseName: kitchen.lowercaseName,
        username: kitchen.userId.username,
        id: kitchen.id,
        role: kitchen.role,
        active: kitchen.active
    };
}
exports.convertKitchenToResponseObject = convertKitchenToResponseObject;
function getPopulatedKitchenById(kitchenId) {
    return models_1.KitchenModel.findOne({ _id: kitchenId })
        .then(function (responsedKitchen) {
        if (responsedKitchen) {
            return responsedKitchen.populate('userId').execPopulate()
                .then(function (populatedKitchen) {
                return Promise.resolve(convertKitchenToResponseObject(populatedKitchen));
            })
                .catch(function (error) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            });
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Staff not found.'
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
function getPopulatedKitchenByUserId(userId) {
    return models_1.KitchenModel.findOne({ userId: userId })
        .then(function (responsedKitchen) {
        if (responsedKitchen) {
            return responsedKitchen.populate('userId').execPopulate()
                .then(function (populatedKitchen) {
                return Promise.resolve(convertKitchenToResponseObject(populatedKitchen));
            })
                .catch(function (error) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            });
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Staff not found.'
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
function getOriginKitchen(kitchenId) {
    return models_1.KitchenModel.findOne({ _id: kitchenId })
        .then(function (responsedKitchen) {
        if (responsedKitchen) {
            return Promise.resolve(responsedKitchen);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Kitchen not found.'
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
function insertKitchen(kitchen) {
    return models_1.KitchenModel.findOne({ name: kitchen.name })
        .then(function (existedKitchen) {
        if (!existedKitchen) {
            var newKitchen = new models_1.KitchenModel(kitchen);
            return newKitchen.save()
                .then(function (responsedKitchen) {
                return responsedKitchen.populate('userId').execPopulate()
                    .then(function (populatedKitchen) {
                    return Promise.resolve(convertKitchenToResponseObject(populatedKitchen));
                })
                    .catch(function (error) {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                });
            })
                .catch(function (error) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            });
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Duplicate kitchen name.'
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
function removeKitchen(staffId) {
    return models_1.KitchenModel.findOne({ _id: staffId })
        .then(function (responsedKitchen) {
        responsedKitchen.remove()
            .then(function () { return Promise.resolve('Remove kitchen successfully.'); })
            .catch(function () { return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        }); });
    })
        .catch(function (error) { return Promise.reject({
        statusCode: 500,
        message: 'Internal server error.'
    }); });
}
function updateKitchen(kitchen) {
    return models_1.KitchenModel.findOne({ _id: kitchen.id })
        .then(function (responsedKitchen) {
        responsedKitchen.name = kitchen.name;
        responsedKitchen.active = kitchen.active;
        return responsedKitchen.save()
            .then(function (updatedKitchen) {
            return updatedKitchen.populate('userId').execPopulate()
                .then(function (populatedKitchen) {
                return Promise.resolve(convertKitchenToResponseObject(populatedKitchen));
            })
                .catch(function (error) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            });
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getKitchenList(pageIndex, pageSize) {
    return models_1.KitchenModel.count({})
        .then(function (count) {
        return models_1.KitchenModel.find({}).sort({ name: -1 })
            .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
            .limit(pageSize)
            .populate('userId')
            .then(function (kitchens) {
            var response = shared_1.paginate(kitchens, count, pageIndex, pageSize);
            for (var i in response.items) {
                if (response.items[i]) {
                    response.items[i] = convertKitchenToResponseObject(response.items[i]);
                }
            }
            return Promise.resolve(response);
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getAllKitchens() {
    return models_1.KitchenModel.find({}).sort({ name: -1 })
        .populate('userId')
        .then(function (kitchens) {
        var response = [];
        for (var i in kitchens) {
            if (kitchens[i]) {
                response[i] = convertKitchenToResponseObject(kitchens[i]);
            }
        }
        return Promise.resolve(response);
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
exports.kitchenDao = {
    insertKitchen: insertKitchen,
    removeKitchen: removeKitchen,
    updateKitchen: updateKitchen,
    getOriginKitchen: getOriginKitchen,
    getPopulatedKitchenById: getPopulatedKitchenById,
    getPopulatedKitchenByUserId: getPopulatedKitchenByUserId,
    getAllKitchens: getAllKitchens
};
//# sourceMappingURL=kitchen.dao.js.map