import { IUser, UserModel } from '../models';
import { IError, cryptoUtils } from '../shared';

function getSalt(username: string): Promise<string | IError> {
    return UserModel.findOne({ username: username })
        .then(
        (responsedUser: IUser) => {
            if (responsedUser) {
                return Promise.resolve(responsedUser.salt);
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'User does not exist.'
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

function checkPassword(username: string, password: string): Promise<boolean | IError> {
    return getSalt(username)
        .then(
        salt => {
            const hashPassword = cryptoUtils.hashWithSalt(password, <string>salt).password;
            return UserModel.findOne({ username: username })
                .then(
                (responsedUser: IUser) => Promise.resolve(responsedUser.password === hashPassword)
                )
                .catch(
                error => Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                })
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

function updatePassword(username: string, { password, salt }) {
    return UserModel.findOne({ username: username })
        .then(
        (responsedUser: IUser) => {
            responsedUser.password = password;
            responsedUser.salt = salt;
            return updateUser(responsedUser)
                .then(
                () => Promise.resolve()
                )
                .catch(
                error => Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                })
                );
        }
        )
        .catch(
        error => Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        })
        );
}

function updateUser(user: IUser): Promise<IUser | IError> {
    const updatedUser = new UserModel(user);
    return updatedUser.save()
        .then(
        (responsedUser: IUser) => Promise.resolve(responsedUser)
        )
        .catch(
        error => Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        })
        );
}

function insertUser(user: IUser): Promise<IUser | IError> {
    return UserModel.findOne({ username: user.username })
        .then(
        responsedUser => {
            if (responsedUser) {
                return Promise.reject({
                    statusCode: 400,
                    message: 'User already exist.'
                });
            } else {
                const newUser = new UserModel(user);
                return newUser.save()
                    .then(
                    (savedUser: IUser) => Promise.resolve(savedUser)
                    )
                    .catch(
                    err => Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    })
                    );
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

function deleteUser(username: string): Promise<any> {
    return UserModel.findOneAndRemove({ username: username })
        .then(
        () => {
            return Promise.resolve('Delete user successfully.');
        }
        )
        .catch(
        () => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

function getUser(username: string): Promise<IUser> {
    return UserModel.findOne({ username: username })
        .then(
        (user) => {
            if (user) {
                return Promise.resolve(user);
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'User not found.'
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

export const userDao = {
    updateUser: updateUser,
    insertUser: insertUser,
    getSalt: getSalt,
    checkPassword: checkPassword,
    updatePassword: updatePassword,
    deleteUser: deleteUser,
    getUser: getUser
};
