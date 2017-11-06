import * as express from 'express';
import { IError, ISuccess, cryptoUtils } from '../shared';
import { userDao, staffDao } from '../dao';
import { IUser, IUserModel, IStaff } from '../models';

function createStaff(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body.username || !request.body.password ||
        !request.body.fullname || !request.body.birthdate || !request.body.gender) {
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
        role: 'staff'
    };
    return userDao.insertUser(newUser)
        .then(
        (responsedUser: IUser) => {
            const newStaff: IStaff = {
                birthdate: request.body.birthdate,
                fullname: request.body.fullname,
                gender: request.body.gender,
                userId: responsedUser.id,
                active: true
            };
            return staffDao.insertStaff(newStaff)
                .then(
                (responsedStaff) => {
                    return Promise.resolve({
                        message: 'Create new staff successfully.',
                        data: {
                            staff: responsedStaff
                        }
                    });
                }
                )
                .catch(
                () => {
                    userDao.deleteUser(responsedUser.username).then(() => { }).catch(() => { });
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
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

function deleteStaff(request: express.Request): Promise<ISuccess | IError> {
    return staffDao.removeStaff(request.query.id)
        .then(
        () => Promise.resolve({
            message: 'Delete staff successfully.',
            data: {}
        })
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

function setActiveStaff(request: express.Request): Promise<ISuccess | IError> {
    return staffDao.getOriginStaff(request.query.id)
        .then(
        (responsedStaff) => {
            const staff: IStaff = {
                id: request.query.id,
                fullname: responsedStaff.fullname,
                birthdate: responsedStaff.birthdate,
                gender: responsedStaff.gender,
                userId: responsedStaff.userId,
                active: request.query.state
            };
            return staffDao.updatedStaff(staff)
                .then(
                (deactivatedStaff) => {
                    return Promise.resolve({
                        message: 'Deactivate staff successfully.',
                        data: {
                            staff: deactivatedStaff
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

function getStaff(request: express.Request): Promise<ISuccess | IError> {
    return staffDao.getPopulatedStaff(request.query.id)
        .then(
        (response) => Promise.resolve({
            message: 'Get staff successfully.',
            data: {
                staff: response
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

function updateStaff(request: express.Request) {
    return staffDao.getOriginStaff(request.query.id)
        .then(
        (responsedStaff) => {
            const staff: IStaff = {
                id: request.query.id,
                fullname: request.query.fullname,
                birthdate: request.query.birthdate,
                gender: request.query.gender,
                userId: responsedStaff.userId,
                active: request.query.state
            };
            return staffDao.updatedStaff(staff)
                .then(
                (updatedStaff) => {
                    return Promise.resolve({
                        message: 'Update staff successfully.',
                        data: {
                            staff: updatedStaff
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

export const staffController = {
    createStaff: createStaff,
    // deleteStaff: deleteStaff
    setActiveStaff: setActiveStaff,
    getStaff: getStaff,
    updateStaff: updateStaff
};
