"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dao_1 = require("../dao");
var middlewares_1 = require("../middlewares");
function createFood(request) {
    if (!request.body.name || !request.body.description ||
        !request.body.price || !request.body.categories) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    var newFood = {
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        pictures: request.body.uploadedImages,
        categories: request.body.categories.split(','),
        active: true
    };
    return dao_1.foodDao.insertFood(newFood)
        .then(function (responsedFood) {
        return Promise.resolve({
            message: 'Create new food successfully.',
            data: {
                food: responsedFood
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
function setActiveFood(request) {
    return dao_1.foodDao.getOriginFood(request.query.id)
        .then(function (responsedFood) {
        var food = {
            id: request.query.id,
            name: responsedFood.name,
            categories: responsedFood.categories,
            description: responsedFood.description,
            pictures: responsedFood.pictures,
            price: responsedFood.price,
            active: request.query.state
        };
        return dao_1.foodDao.updateFood(food)
            .then(function (deactivatedFood) {
            return Promise.resolve({
                message: 'Deactivate food successfully.',
                data: {
                    food: deactivatedFood
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
function getFood(request) {
    return dao_1.foodDao.getPopulatedFoodById(request.query.id)
        .then(function (response) { return Promise.resolve({
        message: 'Get food successfully.',
        data: {
            food: response
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
function updateFood(request) {
    return dao_1.foodDao.getOriginFood(request.query.id)
        .then(function (responsedFood) {
        if (request.body.gender === undefined) {
            request.body.gender = responsedFood.gender;
        }
        if (request.body.pictrues && request.body.pictrues !== '') {
            request.body.pictrues = request.body.pictures.split(',');
            request.body.pictures = request.body.uploadedImages.concat(request.body.pictures);
        }
        else {
            request.body.pictures = request.body.uploadedImages;
        }
        for (var _i = 0, _a = responsedFood.pictures; _i < _a.length; _i++) {
            var img = _a[_i];
            if (request.body.pictures.indexOf(img) < 0) {
                middlewares_1.rollbackUploadedFiles([img]);
            }
        }
        if (request.body.categories) {
            request.body.categories = request.body.categories.split(',');
        }
        var food = {
            id: request.query.id,
            name: request.body.name || responsedFood.name,
            categories: request.body.categories || responsedFood.categories,
            description: request.body.description || responsedFood.description,
            pictures: request.body.pictures,
            price: request.body.price || responsedFood.price,
            active: responsedFood.active
        };
        return dao_1.foodDao.updateFood(food)
            .then(function (updatedFood) {
            return Promise.resolve({
                message: 'Update food successfully.',
                data: {
                    food: updatedFood
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
function getFoodList(request) {
    if (!request.query.pageindex) {
        request.query.pageindex = '1';
    }
    if (!request.query.pagesize) {
        request.query.pagesize = '20';
    }
    return dao_1.foodDao.getFoodList(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
        .then(function (response) { return Promise.resolve({
        message: 'Get foods successfully.',
        data: {
            foods: response
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
function getAllFood(request, active) {
    if (!active) {
        return dao_1.foodDao.getAllFood()
            .then(function (response) { return Promise.resolve({
            message: 'Get foods successfully.',
            data: {
                foods: response
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
    else {
        return dao_1.foodDao.getAllFoodActive()
            .then(function (response) { return Promise.resolve({
            message: 'Get foods successfully.',
            data: {
                foods: response
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
}
exports.foodController = {
    createFood: createFood,
    setActiveFood: setActiveFood,
    getFood: getFood,
    updateFood: updateFood,
    getFoodList: getFoodList,
    getAllFood: getAllFood
};
//# sourceMappingURL=food.controller.js.map