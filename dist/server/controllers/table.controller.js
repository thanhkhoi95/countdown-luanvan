"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dao_1 = require("../dao");
function getAllTable(request, active) {
    if (!active) {
        return dao_1.tableDao.getAllTables()
            .then(function (response) { return Promise.resolve({
            message: 'Get all tables successfully.',
            data: {
                tables: response
            }
        }); })
            .catch(function (error) {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    }
    else {
        return dao_1.tableDao.getAllTablesActive()
            .then(function (response) { return Promise.resolve({
            message: 'Get all tables successfully.',
            data: {
                tables: response
            }
        }); })
            .catch(function (error) {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    }
}
function createTable(request) {
    if (!request.body.name) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    var newTable = {
        name: request.body.name,
        status: 'available',
        active: true
    };
    return dao_1.tableDao.insertTable(newTable)
        .then(function (responsedTable) {
        return Promise.resolve({
            message: 'Create new table successfully.',
            data: {
                table: responsedTable
            }
        });
    })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
function setActiveTable(request) {
    return dao_1.tableDao.getOriginTable(request.query.id)
        .then(function (responsedTable) {
        var table = {
            id: request.query.id,
            name: responsedTable.name,
            status: responsedTable.status,
            active: request.query.state
        };
        return dao_1.tableDao.updateTable(table)
            .then(function (deactivatedTable) {
            return Promise.resolve({
                message: 'Set active table successfully.',
                data: {
                    table: deactivatedTable
                }
            });
        })
            .catch(function (error) {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
function getTable(request) {
    return dao_1.tableDao.getPopulatedTableById(request.query.id)
        .then(function (response) { return Promise.resolve({
        message: 'Get table successfully.',
        data: {
            table: response
        }
    }); })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
function updateTable(request) {
    return dao_1.tableDao.getOriginTable(request.query.id)
        .then(function (responsedTable) {
        var table = {
            id: request.query.id,
            name: request.body.name || responsedTable.name,
            status: request.body.status || responsedTable.status,
            active: responsedTable.active
        };
        return dao_1.tableDao.updateTable(table)
            .then(function (updatedTable) {
            return Promise.resolve({
                message: 'Update table successfully.',
                data: {
                    table: updatedTable
                }
            });
        })
            .catch(function (error) {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
function updateStatus(request) {
    return dao_1.tableDao.getOriginTable(request.query.id)
        .then(function (responsedTable) {
        var table = {
            id: request.query.id,
            name: responsedTable.name,
            status: request.body.status || responsedTable.status,
            active: responsedTable.active
        };
        return dao_1.tableDao.updateTable(table)
            .then(function (updatedTable) {
            return Promise.resolve({
                message: 'Update table successfully.',
                data: {
                    table: updatedTable
                }
            });
        })
            .catch(function (error) {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
function getTableList(request) {
    if (!request.query.pageindex) {
        request.query.pageindex = '1';
    }
    if (!request.query.pagesize) {
        request.query.pagesize = '20';
    }
    return dao_1.tableDao.getTableList(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
        .then(function (response) { return Promise.resolve({
        message: 'Get tables successfully.',
        data: {
            tables: response
        }
    }); })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
exports.tableController = {
    createTable: createTable,
    setActiveTable: setActiveTable,
    getTable: getTable,
    updateTable: updateTable,
    getTableList: getTableList,
    getAllTable: getAllTable,
    updateStatus: updateStatus
};
//# sourceMappingURL=table.controller.js.map