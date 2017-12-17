"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var shared_1 = require("../shared");
function convertToResponseObject(food) {
    return {
        name: food.name,
        lowercaseName: food.lowercaseName,
        description: food.description,
        pictures: food.pictures,
        categories: food.categories,
        price: food.price,
        active: food.active,
        id: food.id
    };
}
function getPopulatedFoodById(foodId) {
    return models_1.FoodModel.findOne({ _id: foodId })
        .then(function (responsedFood) {
        if (responsedFood) {
            return responsedFood.populate({
                path: 'categories',
                model: 'category'
            }).execPopulate()
                .then(function (populatedFood) {
                return Promise.resolve(convertToResponseObject(populatedFood));
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
                message: 'Food not found.'
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
function getOriginFood(foodId) {
    return models_1.FoodModel.findOne({ _id: foodId })
        .then(function (responsedFood) {
        if (responsedFood) {
            return Promise.resolve(responsedFood);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Food not found.'
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
function insertFood(food) {
    var newFood = new models_1.FoodModel(food);
    return newFood.save()
        .then(function (responsedFood) {
        return responsedFood.populate({
            path: 'categories',
            model: 'category'
        }).execPopulate()
            .then(function (populatedFood) {
            return Promise.resolve(convertToResponseObject(populatedFood));
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
// function removeFood(foodId: string): Promise<any> {
//     return FoodModel.findOne({ _id: foodId })
//         .then(
//         (responsedFood: IFoodModel) => {
//             responsedFood.remove()
//                 .then(
//                 () => Promise.resolve('Remove food successfully.')
//                 )
//                 .catch(
//                 () => Promise.reject({
//                     statusCode: 500,
//                     message: 'Internal server error.'
//                 })
//                 );
//         }
//         )
//         .catch(
//         error => Promise.reject({
//             statusCode: 500,
//             message: 'Internal server error.'
//         })
//         );
// }
function updateFood(food) {
    return models_1.FoodModel.findOne({ _id: food.id })
        .then(function (responsedFood) {
        responsedFood.name = food.name;
        responsedFood.description = food.description;
        responsedFood.pictures = food.pictures;
        responsedFood.active = food.active;
        responsedFood.price = food.price;
        responsedFood.categories = food.categories;
        return responsedFood.save()
            .then(function (updatedFood) {
            return updatedFood.populate({
                path: 'categories',
                model: 'category'
            }).execPopulate()
                .then(function (populatedFood) {
                return Promise.resolve(convertToResponseObject(populatedFood));
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
function getFoodList(pageIndex, pageSize) {
    return models_1.FoodModel.count({})
        .then(function (count) {
        return models_1.FoodModel.find({}).sort({ name: -1 })
            .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
            .limit(pageSize)
            .populate({
            path: 'categories',
            model: 'category'
        })
            .then(function (foods) {
            var response = shared_1.paginate(foods, count, pageIndex, pageSize);
            for (var i in response.items) {
                if (response.items[i]) {
                    response.items[i] = convertToResponseObject(response.items[i]);
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
function getAllFood() {
    return models_1.FoodModel.find({}).sort({ name: -1 })
        .populate({
        path: 'categories',
        model: 'category'
    })
        .then(function (foods) {
        var response = [];
        for (var i in foods) {
            if (foods[i]) {
                response[i] = convertToResponseObject(foods[i]);
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
function getAllFoodActive() {
    return models_1.FoodModel.find({ active: true }).sort({ name: 1 })
        .populate({
        path: 'categories',
        model: 'category'
    })
        .then(function (foods) {
        var response = [];
        for (var i in foods) {
            if (foods[i]) {
                response[i] = convertToResponseObject(foods[i]);
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
exports.foodDao = {
    insertFood: insertFood,
    updateFood: updateFood,
    getOriginFood: getOriginFood,
    getPopulatedFoodById: getPopulatedFoodById,
    getFoodList: getFoodList,
    getAllFood: getAllFood,
    getAllFoodActive: getAllFoodActive
};
//# sourceMappingURL=food.dao.js.map