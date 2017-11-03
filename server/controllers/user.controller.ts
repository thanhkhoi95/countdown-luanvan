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
        return userDao.updateUser(request.body)
            .then(
            response => Promise.resolve({
                message: 'Password changed successfully',
                data: {
                    user: response
                }
            })
            )
            .catch(
            error => Promise.reject(error)
            );
    }
}

export const userController = {
    changePassword: changePassword
};
