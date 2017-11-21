import * as express from 'express';
import { IError, ISuccess, cryptoUtils } from '../shared';
import { userDao, foodDao } from '../dao';
import { IUser, IUserModel, IFood } from '../models';
import { rollbackUploadedFiles } from '../middlewares';

function createFood(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body.name || !request.body.description ||
        !request.body.price || !request.body.categories) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    const newFood: IFood = {
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        pictures: request.body.uploadedImages,
        categories: request.body.categories.split(','),
        active: true
    };
    return foodDao.insertFood(newFood)
        .then(
        (responsedFood) => {
            return Promise.resolve({
                message: 'Create new food successfully.',
                data: {
                    food: responsedFood
                }
            });
        }
        )
        .catch(
        (error) => {
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

function setActiveFood(request: express.Request): Promise<ISuccess | IError> {
    return foodDao.getOriginFood(request.query.id)
        .then(
        (responsedFood) => {
            const food: IFood = {
                id: request.query.id,
                name: responsedFood.name,
                categories: responsedFood.categories,
                description: responsedFood.description,
                pictures: responsedFood.pictures,
                price: responsedFood.price,
                active: request.query.state
            };
            return foodDao.updateFood(food)
                .then(
                (deactivatedFood) => {
                    return Promise.resolve({
                        message: 'Deactivate food successfully.',
                        data: {
                            food: deactivatedFood
                        }
                    });
                }
                )
                .catch(
                (error) => {
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
        )
        .catch(
        (error) => {
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

function getFood(request: express.Request): Promise<ISuccess | IError> {
    return foodDao.getPopulatedFoodById(request.query.id)
        .then(
        (response) => Promise.resolve({
            message: 'Get food successfully.',
            data: {
                food: response
            }
        })
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

function updateFood(request: express.Request): Promise<ISuccess | IError> {
    return foodDao.getOriginFood(request.query.id)
        .then(
        (responsedFood) => {
            if (request.body.gender === undefined) {
                request.body.gender = responsedFood.gender;
            }
            if (request.body.pictrues && request.body.pictrues !== '') {
                request.body.pictrues = request.body.pictures.split(',');
                request.body.pictures = [...request.body.uploadedImages, ...request.body.pictures];
            } else {
                request.body.pictures = request.body.uploadedImages;
            }
            for (const img of responsedFood.pictures) {
                if (request.body.pictures.indexOf(img) < 0) {
                    rollbackUploadedFiles([img]);
                }
            }
            if (request.body.categories) {
                request.body.categories = request.body.categories.split(',');
            }
            const food: IFood = {
                id: request.query.id,
                name: request.body.name || responsedFood.name,
                categories: request.body.categories || responsedFood.categories,
                description: request.body.description || responsedFood.description,
                pictures: request.body.pictures,
                price: request.body.price || responsedFood.price,
                active: responsedFood.active
            };
            return foodDao.updateFood(food)
                .then(
                (updatedFood) => {
                    return Promise.resolve({
                        message: 'Update food successfully.',
                        data: {
                            food: updatedFood
                        }
                    });
                }
                )
                .catch(
                (error) => {
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
        )
        .catch(
        (error) => {
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

function getFoodList(request: express.Request): Promise<ISuccess | IError> {
    if (!request.query.pageindex) {
        request.query.pageindex = '1';
    }
    if (!request.query.pagesize) {
        request.query.pagesize = '20';
    }
    return foodDao.getFoodList(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
        .then(
        (response) => Promise.resolve({
            message: 'Get foods successfully.',
            data: {
                foods: response
            }
        })
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

function getAllFood(request: express.Request, active?: boolean): Promise<ISuccess | IError> {
    if (!active) {
        return foodDao.getAllFood()
            .then(
            (response) => Promise.resolve({
                message: 'Get foods successfully.',
                data: {
                    foods: response
                }
            })
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
    } else {
        return foodDao.getAllFoodActive()
        .then(
        (response) => Promise.resolve({
            message: 'Get foods successfully.',
            data: {
                foods: response
            }
        })
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
}

export const foodController = {
    createFood: createFood,
    setActiveFood: setActiveFood,
    getFood: getFood,
    updateFood: updateFood,
    getFoodList: getFoodList,
    getAllFood: getAllFood
};
