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
                userId: responsedUser.id
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

export const staffController = {
    createStaff: createStaff,
    deleteStaff: deleteStaff
};