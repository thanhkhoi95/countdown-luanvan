import * as express from 'express';
import { IError, ISuccess, cryptoUtils } from '../shared';
import { userDao, tableDao } from '../dao';
import { IUser, IUserModel, ITable } from '../models';

function getAllTable(request: express.Request, active?: boolean): Promise<ISuccess | IError> {
    if (!active) {
        return tableDao.getAllTables()
            .then(
            (response) => Promise.resolve({
                message: 'Get all tables successfully.',
                data: {
                    tables: response
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
    } else {
        return tableDao.getAllTablesActive()
            .then(
            (response) => Promise.resolve({
                message: 'Get all tables successfully.',
                data: {
                    tables: response
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
}

function createTable(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body.name) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    const newTable: ITable = {
        name: request.body.name,
        status: 'available',
        active: true
    };
    return tableDao.insertTable(newTable)
        .then(
        (responsedTable) => {
            return Promise.resolve({
                message: 'Create new table successfully.',
                data: {
                    table: responsedTable
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

function setActiveTable(request: express.Request): Promise<ISuccess | IError> {
    return tableDao.getOriginTable(request.query.id)
        .then(
        (responsedTable) => {
            const table: ITable = {
                id: request.query.id,
                name: responsedTable.name,
                status: responsedTable.status,
                active: request.query.state
            };
            return tableDao.updateTable(table)
                .then(
                (deactivatedTable) => {
                    return Promise.resolve({
                        message: 'Set active table successfully.',
                        data: {
                            table: deactivatedTable
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
        (responsedTable) => {
            const table: ITable = {
                id: request.query.id,
                name: request.body.name || responsedTable.name,
                status: request.body.status || responsedTable.status,
                active: responsedTable.active
            };
            return tableDao.updateTable(table)
                .then(
                (updatedTable) => {
                    return Promise.resolve({
                        message: 'Update table successfully.',
                        data: {
                            table: updatedTable
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

function updateStatus(request: express.Request): Promise<ISuccess | IError> {
    return tableDao.getOriginTable(request.query.id)
        .then(
        (responsedTable) => {
            const table: ITable = {
                id: request.query.id,
                name: responsedTable.name,
                status: request.body.status || responsedTable.status,
                active: responsedTable.active
            };
            return tableDao.updateTable(table)
                .then(
                (updatedTable) => {
                    return Promise.resolve({
                        message: 'Update table successfully.',
                        data: {
                            table: updatedTable
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
    return tableDao.getTableList(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
        .then(
        (response) => Promise.resolve({
            message: 'Get tables successfully.',
            data: {
                tables: response
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

export const tableController = {
    createTable: createTable,
    setActiveTable: setActiveTable,
    getTable: getTable,
    updateTable: updateTable,
    getTableList: getTableList,
    getAllTable: getAllTable,
    updateStatus: updateStatus
};
