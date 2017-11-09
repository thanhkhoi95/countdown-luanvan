import * as express from 'express';
import { IError, ISuccess, cryptoUtils } from '../shared';
import { userDao, kitchenDao } from '../dao';
import { IUser, IUserModel, IKitchen } from '../models';

function createKitchen(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body.username || !request.body.password || !request.body.name) {
        return Promise.reject({
            statusCode: 404,
            message: 'Data fields missing.'
        });
    }
    const passwordObject = cryptoUtils.hashWithSalt(request.body.password);
    const newUser: IUser = {
        username: request.body.username,
        password: passwordObject.password,
        salt: passwordObject.salt,
        role: 'kitchen'
    };
    return userDao.insertUser(newUser)
        .then(
        (responsedUser: IUser) => {
            const newKitchen: IKitchen = {
                name: request.body.name,
                userId: responsedUser.id,
                active: true
            };
            return kitchenDao.insertKitchen(newKitchen)
                .then(
                (responsedKitchen) => {
                    return Promise.resolve({
                        message: 'Create new kitchen successfully.',
                        data: {
                            kitchen: responsedKitchen
                        }
                    });
                }
                )
                .catch(
                (error) => {
                    userDao.deleteUser(responsedUser.username).then(() => { }).catch(() => { });
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

function setActiveKitchen(request: express.Request): Promise<ISuccess | IError> {
    return kitchenDao.getOriginKitchen(request.query.id)
        .then(
        (responsedKitchen) => {
            const kitchen: IKitchen = {
                id: request.query.id,
                name: responsedKitchen.name,
                userId: responsedKitchen.userId,
                active: request.query.state
            };
            return kitchenDao.updateKitchen(kitchen)
                .then(
                (deactivatedKitchen) => {
                    return Promise.resolve({
                        message: 'Deactivate kitchen successfully.',
                        data: {
                            kitchen: deactivatedKitchen
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

function getKitchen(request: express.Request): Promise<ISuccess | IError> {
    return kitchenDao.getPopulatedKitchenById(request.query.id)
        .then(
        (response) => Promise.resolve({
            message: 'Get kitchen successfully.',
            data: {
                kitchen: response
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

function updateKitchen(request: express.Request): Promise<ISuccess | IError> {
    return kitchenDao.getOriginKitchen(request.query.id)
        .then(
        (responsedKitchen ) => {
            if (request.body.gender === undefined) {
                request.body.gender = responsedKitchen.gender;
            }
            const kitchen: IKitchen = {
                id: request.query.id,
                name: request.body.name || responsedKitchen.name,
                userId: responsedKitchen.userId,
                active: responsedKitchen.active
            };
            return kitchenDao.updateKitchen(kitchen)
                .then(
                (updatedKitchen) => {
                    return Promise.resolve({
                        message: 'Update kitchen successfully.',
                        data: {
                            kitchen: updatedKitchen
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

function getKitchenList(request: express.Request): Promise<ISuccess | IError> {
    if (!request.query.pageindex) {
        request.query.pageindex = '1';
    }
    if (!request.query.pagesize) {
        request.query.pagesize = '20';
    }
    return kitchenDao.getAllKitchens(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
    .then(
        (response) => Promise.resolve({
            message: 'Get kitchens successfully.',
            data: {
                kitchens: response
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

export const kitchenController = {
    createKitchen: createKitchen,
    setActiveKitchen: setActiveKitchen,
    getKitchen: getKitchen,
    updateKitchen: updateKitchen,
    getKitchenList: getKitchenList
};
