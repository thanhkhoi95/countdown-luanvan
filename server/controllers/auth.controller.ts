import * as express from 'express';
import { IError, ISuccess, cryptoUtils, tokenSign } from '../shared';
import { userDao, staffDao, tableDao, kitchenDao, convertStaffToResponseObject, convertKitchenToResponseObject } from '../dao';
import { IUser, IUserModel, IStaff } from '../models';
import { TableModel } from '../models';
import config from '../config';

function login(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body.username || !request.body.password) {
        const error: IError = {
            statusCode: 400,
            message: 'Data fields missing.'
        };
        return Promise.reject(error);
    }
    if (request.body.username === config.admin.username &&
        request.body.password === config.admin.password) {
        const tokenObject = {
            role: 'admin',
            username: 'admin'
        };
        const promise = new Promise<ISuccess | IError>((resolve, reject) => {
            tokenSign(tokenObject, (err, token) => {
                if (!err) {
                    resolve({
                        message: 'Login successfully.',
                        data: {
                            token: token
                        }
                    });
                } else {
                    reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
            });
        });
        return promise;
    }
    return userDao.checkPassword(request.body.username, request.body.password)
        .then(
        (flag) => {
            if (flag) {
                return userDao.getUser(request.body.username)
                    .then(
                    (user) => {
                        if (user.role === 'staff') {
                            return staffDao.getPopulatedStaffByUserId(user.id)
                                .then(
                                (staff) => {
                                    if (staff.active === false) {
                                        return Promise.reject({
                                            statusCode: 400,
                                            message: 'Wrong username or password.'
                                        });
                                    }
                                    staff.role = 'staff';
                                    staff._id = staff.id;
                                    const tokenObject = {
                                        role: 'staff',
                                        userId: user.id,
                                        staff: staff
                                    };
                                    const promise = new Promise<ISuccess | IError>((resolve, reject) => {
                                        tokenSign(tokenObject, (err, token) => {
                                            if (!err) {
                                                resolve({
                                                    message: 'Login successfully.',
                                                    data: {
                                                        token: token
                                                    }
                                                });
                                            } else {
                                                reject({
                                                    statusCode: 500,
                                                    message: 'Internal server error.'
                                                });
                                            }
                                        });
                                    });
                                    return promise;
                                }
                                )
                                .catch(
                                error => {
                                    return Promise.reject(error);
                                }
                                );
                        } else if (user.role === 'kitchen') {
                            return kitchenDao.getPopulatedKitchenByUserId(user.id)
                                .then(
                                (kitchen) => {
                                    if (kitchen.active === false) {
                                        return Promise.reject({
                                            statusCode: 400,
                                            message: 'Wrong username or password.'
                                        });
                                    }
                                    kitchen.role = 'kitchen';
                                    kitchen._id = kitchen.id;
                                    const tokenObject = {
                                        role: 'kitchen',
                                        userId: user.id,
                                        kitchen: kitchen
                                    };
                                    const promise = new Promise<ISuccess | IError>((resolve, reject) => {
                                        tokenSign(tokenObject, (err, token) => {
                                            if (!err) {
                                                resolve({
                                                    message: 'Login successfully.',
                                                    data: {
                                                        token: token
                                                    }
                                                });
                                            } else {
                                                console.log(4);
                                                reject({
                                                    statusCode: 500,
                                                    message: 'Internal server error.'
                                                });
                                            }
                                        });
                                    });
                                    return promise;
                                }
                                )
                                .catch(
                                error => Promise.reject(error)
                                );
                        }
                    }
                    )
                    .catch(
                    error => Promise.reject(error)
                    );
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Wrong username or password.'
                });
            }
        }
        )
        .catch(
        error => Promise.reject(error)
        );
}

function tableLogin(request: express.Request): Promise<ISuccess | IError> {
    return TableModel.findOne({ name: request.body.name })
        .then(
        (table) => {
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
                const tokenObject = {
                    role: 'table',
                    name: table.name,
                    _id: table.id
                };
                const promise = new Promise<ISuccess | IError>((resolve, reject) => {
                    tokenSign(tokenObject, (err, token) => {
                        if (!err) {
                            table.status = 'serving';
                            console.log(table);
                            tableDao.updateTable(table).catch((error) => console.log(error));
                            resolve({
                                message: 'Login successfully.',
                                data: {
                                    table: table,
                                    token: token
                                }
                            });
                        } else {
                            reject({
                                statusCode: 500,
                                message: 'Internal server error.'
                            });
                        }
                    });
                });
                return promise;
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Wrong table id.'
                });
            }
        }
        )
        .catch(
        error => Promise.reject(error)
        );
}

export const authController = {
    login: login,
    tableLogin: tableLogin
};
