import * as express from 'express';
import { IError, ISuccess, cryptoUtils, tokenSign } from '../shared';
import { userDao, staffDao } from '../dao';
import { IUser, IUserModel, IStaff } from '../models';

function login(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body.username || !request.body.password) {
        const error: IError = {
            statusCode: 400,
            message: 'Data fields missing.'
        };
        return Promise.reject(error);
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
                                    const tokenObject = {
                                        role: staff,
                                        ownerId: staff.id,
                                        userId: user.id,
                                        username: user.username
                                    };
                                    const promise = new Promise<ISuccess | IError>((resolve, reject) => {
                                        tokenSign(tokenObject, (err, token) => {
                                            if (!err) {
                                                resolve({
                                                    message: 'Login successfully.',
                                                    data: {
                                                        info: staff,
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

export const authController = {
    login: login
};
