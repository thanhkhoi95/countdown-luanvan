import { FoodModel, IFood, IFoodModel } from '../models';
import { paginate } from '../shared';

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

function getPopulatedFoodById(foodId: string): Promise<any> {
    return FoodModel.findOne({ _id: foodId })
        .then(
        (responsedFood) => {
            if (responsedFood) {
                return responsedFood.populate({
                    path: 'categories',
                    model: 'category'
                }).execPopulate()
                    .then(
                    (populatedFood: IFood) => {
                        return Promise.resolve(convertToResponseObject(populatedFood));
                    }
                    )
                    .catch(
                    error => {
                        return Promise.reject({
                            statusCode: 500,
                            message: 'Internal server error.'
                        });
                    }
                    );
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Food not found.'
                });
            }
        }
        )
        .catch(
        error => {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            } else {
                return Promise.reject(error);
            }
        }
        );
}

function getOriginFood(foodId: string): Promise<any> {
    return FoodModel.findOne({ _id: foodId })
        .then(
        (responsedFood) => {
            if (responsedFood) {
                return Promise.resolve(responsedFood);
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Food not found.'
                });
            }
        }
        )
        .catch(
        error => {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            } else {
                return Promise.reject(error);
            }
        }
        );
}

function insertFood(food: IFood): Promise<any> {
    const newFood = new FoodModel(food);
    return newFood.save()
        .then(
        (responsedFood) => {
            return responsedFood.populate({
                path: 'categories',
                model: 'category'
            }).execPopulate()
                .then(
                (populatedFood: IFood) => {
                    return Promise.resolve(convertToResponseObject(populatedFood));
                }
                )
                .catch(
                error => {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
                );
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
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

function updateFood(food: IFood): Promise<any> {
    return FoodModel.findOne({ _id: food.id })
        .then(
        (responsedFood) => {
            responsedFood.name = food.name;
            responsedFood.description = food.description;
            responsedFood.pictures = food.pictures;
            responsedFood.active = food.active;
            responsedFood.price = food.price;
            responsedFood.categories = food.categories;
            return responsedFood.save()
                .then(
                updatedFood => {
                    return updatedFood.populate({
                        path: 'categories',
                        model: 'category'
                    }).execPopulate()
                        .then(
                        (populatedFood: IFood) => {
                            return Promise.resolve(convertToResponseObject(populatedFood));
                        }
                        )
                        .catch(
                        error => {
                            return Promise.reject({
                                statusCode: 500,
                                message: 'Internal server error.'
                            });
                        }
                        );
                }
                )
                .catch(
                error => {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
                );
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

function getFoodList(pageIndex: number, pageSize: number): Promise<any> {
    return FoodModel.count({})
        .then(
        (count: number) => {
            return FoodModel.find({}).sort({ firstname: -1 })
                .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                .limit(pageSize)
                .populate({
                    path: 'categories',
                    model: 'category'
                })
                .then(
                foods => {
                    const response = paginate(foods, count, pageIndex, pageSize);
                    for (const i in response.items) {
                        if (response.items[i]) {
                            response.items[i] = convertToResponseObject(response.items[i]);
                        }
                    }
                    return Promise.resolve(response);
                }
                )
                .catch(
                error => {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
                );
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

function getAllFood(): Promise<any> {
    return FoodModel.find({}).sort({ firstname: -1 })
        .populate({
            path: 'categories',
            model: 'category'
        })
        .then(
        foods => {
            const response = [];
            for (const i in foods) {
                if (foods[i]) {
                    response[i] = convertToResponseObject(foods[i]);
                }
            }
            return Promise.resolve(response);
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

export const foodDao = {
    insertFood: insertFood,
    updateFood: updateFood,
    getOriginFood: getOriginFood,
    getPopulatedFoodById: getPopulatedFoodById,
    getFoodList: getFoodList,
    getAllFood: getAllFood
};
