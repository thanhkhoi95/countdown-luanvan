"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var shared_1 = require("../shared");
function convertTableToResponseObject(table) {
    return {
        name: table.name,
        lowercaseName: table.lowercaseName,
        id: table.id,
        status: table.status,
        active: table.active
    };
}
exports.convertTableToResponseObject = convertTableToResponseObject;
function getPopulatedTableById(tableId) {
    return models_1.TableModel.findOne({ _id: tableId })
        .then(function (responsedTable) {
        if (responsedTable) {
            return Promise.resolve(convertTableToResponseObject(responsedTable));
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Table not found.'
            });
        }
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
function getPopulatedTableByUserId(userId) {
    return models_1.TableModel.findOne({ userId: userId })
        .then(function (responsedTable) {
        if (responsedTable) {
            return Promise.resolve(convertTableToResponseObject(responsedTable));
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Table not found.'
            });
        }
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
function getOriginTable(tableId) {
    return models_1.TableModel.findOne({ _id: tableId })
        .then(function (responsedTable) {
        if (responsedTable) {
            return Promise.resolve(responsedTable);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Table not found.'
            });
        }
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
function insertTable(table) {
    return models_1.TableModel.findOne({ name: table.name })
        .then(function (existedTable) {
        if (!existedTable) {
            var newTable = new models_1.TableModel(table);
            return newTable.save()
                .then(function (responsedTable) {
                return responsedTable.populate('userId').execPopulate()
                    .then(function (populatedTable) {
                    return Promise.resolve(convertTableToResponseObject(populatedTable));
                })
                    .catch(function (error) {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                });
            })
                .catch(function (error) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            });
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Duplicate table name.'
            });
        }
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
function removeTable(staffId) {
    return models_1.TableModel.findOne({ _id: staffId })
        .then(function (responsedTable) {
        responsedTable.remove()
            .then(function () { return Promise.resolve('Remove table successfully.'); })
            .catch(function () { return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        }); });
    })
        .catch(function (error) { return Promise.reject({
        statusCode: 500,
        message: 'Internal server error.'
    }); });
}
function updateTable(table) {
    return models_1.TableModel.findOne({ _id: table.id })
        .then(function (responsedTable) {
        responsedTable.name = table.name;
        responsedTable.status = table.status;
        responsedTable.active = table.active;
        return responsedTable.save()
            .then(function (updatedTable) {
            return updatedTable.populate('userId').execPopulate()
                .then(function (populatedTable) {
                return Promise.resolve(convertTableToResponseObject(populatedTable));
            })
                .catch(function (error) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            });
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getTableList(pageIndex, pageSize) {
    return models_1.TableModel.count({})
        .then(function (count) {
        return models_1.TableModel.find({}).sort({ name: -1 })
            .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
            .limit(pageSize)
            .populate('userId')
            .then(function (tables) {
            var response = shared_1.paginate(tables, count, pageIndex, pageSize);
            for (var i in response.items) {
                if (response.items[i]) {
                    response.items[i] = convertTableToResponseObject(response.items[i]);
                }
            }
            return Promise.resolve(response);
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getAllTables() {
    return models_1.TableModel.find({}).sort({ name: -1 })
        .populate('userId')
        .then(function (tables) {
        var response = [];
        for (var i in tables) {
            if (tables[i]) {
                response[i] = convertTableToResponseObject(tables[i]);
            }
        }
        return Promise.resolve(response);
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getAllTablesActive() {
    return models_1.TableModel.find({ active: true }).sort({ name: 1 })
        .then(function (tables) {
        var response = [];
        for (var i in tables) {
            if (tables[i]) {
                response[i] = convertTableToResponseObject(tables[i]);
            }
        }
        return Promise.resolve(response);
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
exports.tableDao = {
    insertTable: insertTable,
    removeTable: removeTable,
    updateTable: updateTable,
    getOriginTable: getOriginTable,
    getPopulatedTableById: getPopulatedTableById,
    getPopulatedTableByUserId: getPopulatedTableByUserId,
    getTableList: getTableList,
    getAllTables: getAllTables,
    getAllTablesActive: getAllTablesActive
};
//# sourceMappingURL=table.dao.js.map