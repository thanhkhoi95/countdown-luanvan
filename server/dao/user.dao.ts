import { IUser, UserModel } from '../models';
import { IError } from '../shared';

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

export const userDao = {
    updateUser: updateUser,
    insertUser: insertUser
};
