import * as express from 'express';
import { IError, ISuccess, cryptoUtils } from '../shared';
import { userDao } from '../dao';

function changePassword(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body || !request.body.oldPassword || !request.body.newPassword) {
        const error: IError = {
            statusCode: 400,
            message: 'Data fields missing.'
        };
        return Promise.reject(error);
    } else {
        return userDao.getSalt(request.body.username)
            .then(
            salt => {
                return userDao.checkPassword(request.body.username, request.body.oldPassword)
                    .then(
                    response => {
                        if (response === true) {
                            return userDao.updatePassword(request.body.username, cryptoUtils.hashWithSalt(request.body.newPassword))
                                .then(
                                () => Promise.resolve({
                                    message: 'Password changed successfully',
                                    data: {}
                                })
                                )
                                .catch(
                                error => Promise.reject(error)
                                );
                        } else {
                            return Promise.reject({
                                statusCode: 404,
                                message: 'Wrong password.'
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

export const userController = {
    changePassword: changePassword
};
