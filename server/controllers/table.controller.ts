import * as express from 'express';
import { IError, ISuccess, cryptoUtils } from '../shared';
import { userDao, tableDao } from '../dao';
import { IUser, IUserModel, ITable } from '../models';

function createTable(request: express.Request): Promise<ISuccess | IError> {
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
        role: 'table'
    };
    return userDao.insertUser(newUser)
        .then(
        (responsedUser: IUser) => {
            const newTable: ITable = {
                name: request.body.name,
                userId: responsedUser.id,
                active: true
            };
            return tableDao.insertStaff(newTable)
                .then(
                (responsedTable) => {
                    return Promise.resolve({
                        message: 'Create new table successfully.',
                        data: {
                            staff: responsedTable
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

function setActiveTable(request: express.Request): Promise<ISuccess | IError> {
    return tableDao.getOriginTable(request.query.id)
        .then(
        (responsedTable) => {
            const table: ITable = {
                id: request.query.id,
                name: responsedTable.name,
                userId: responsedTable.userId,
                active: request.query.state
            };
            return staffDao.updatedStaff(table)
                .then(
                (deactivatedTable) => {
                    return Promise.resolve({
                        message: 'Deactivate table successfully.',
                        data: {
                            staff: deactivatedTable
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

function getTable(request: express.Request): Promise<ISuccess | IError> {
    return tableDao.getPopulatedTableById(request.query.id)
        .then(
        (response) => Promise.resolve({
            message: 'Get table successfully.',
            data: {
                table: response
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

function updateTable(request: express.Request): Promise<ISuccess | IError> {
    return tableDao.getOriginTable(request.query.id)
        .then(
        (responsedTable ) => {
            if (request.body.gender === undefined) {
                request.body.gender = responsedTable.gender;
            }
            const table: ITable = {
                id: request.query.id,
                name: request.body.name || responsedTable.name,
                userId: responsedTable.userId,
                active: responsedTable.active
            };
            return tableDao.updatedTable(table)
                .then(
                (updatedTable) => {
                    return Promise.resolve({
                        message: 'Update table successfully.',
                        data: {
                            staff: updatedTable
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

function getTableList(request: express.Request): Promise<ISuccess | IError> {
    if (!request.query.pageindex) {
        request.query.pageindex = '1';
    }
    if (!request.query.pagesize) {
        request.query.pagesize = '20';
    }
    return tableDao.getAllTables(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
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

export const staffController = {
    createTable: createTable,
    // deleteStaff: deleteStaff
    setActiveTable: setActiveTable,
    getTable: getTable,
    updateTable: updateTable,
    getTableList: getTableList
};
