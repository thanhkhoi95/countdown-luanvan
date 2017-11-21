import { TableModel, ITable, ITableModel } from '../models';
import { paginate } from '../shared';

export function convertTableToResponseObject(table) {
    return {
        name: table.name,
        lowercaseName: table.lowercaseName,
        id: table.id,
        active: table.active
    };
}

function getPopulatedTableById(tableId: string): Promise<any> {
    return TableModel.findOne({ _id: tableId })
        .then(
        (responsedTable) => {
            if (responsedTable) {
                return Promise.resolve(convertTableToResponseObject(responsedTable));
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Table not found.'
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

function getPopulatedTableByUserId(userId: string): Promise<any> {
    return TableModel.findOne({ userId: userId })
        .then(
        (responsedTable) => {
            if (responsedTable) {
                return Promise.resolve(convertTableToResponseObject(responsedTable));
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Table not found.'
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

function getOriginTable(tableId: string): Promise<any> {
    return TableModel.findOne({ _id: tableId })
        .then(
        (responsedTable) => {
            if (responsedTable) {
                return Promise.resolve(responsedTable);
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Table not found.'
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

function insertTable(table: ITable): Promise<any> {
    return TableModel.findOne({ name: table.name })
        .then(
        (existedTable) => {
            if (!existedTable) {
                const newTable = new TableModel(table);
                return newTable.save()
                    .then(
                    (responsedTable) => {
                        return responsedTable.populate('userId').execPopulate()
                            .then(
                            (populatedTable: ITable) => {
                                return Promise.resolve(convertTableToResponseObject(populatedTable));
                            }
                            )
                            .catch(
                            error => {
                                return Promise.reject({
                                    statusCode: 500,
                                    message: 'Internal server error.'
                                });
                            }
                            );
                    }
                    )
                    .catch(
                    error => {
                        return Promise.reject({
                            statusCode: 500,
                            message: 'Internal server error.'
                        });
                    }
                    );
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Duplicate table name.'
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

function removeTable(staffId: string): Promise<any> {
    return TableModel.findOne({ _id: staffId })
        .then(
        (responsedTable: ITableModel) => {
            responsedTable.remove()
                .then(
                () => Promise.resolve('Remove table successfully.')
                )
                .catch(
                () => Promise.reject({
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

function updateTable(table: ITable): Promise<any> {
    return TableModel.findOne({ _id: table.id })
        .then(
        (responsedTable) => {
            responsedTable.name = table.name;
            responsedTable.active = table.active;
            return responsedTable.save()
                .then(
                updatedTable => {
                    return updatedTable.populate('userId').execPopulate()
                        .then(
                        (populatedTable: ITable) => {
                            return Promise.resolve(convertTableToResponseObject(populatedTable));
                        }
                        )
                        .catch(
                        error => {
                            return Promise.reject({
                                statusCode: 500,
                                message: 'Internal server error.'
                            });
                        }
                        );
                }
                )
                .catch(
                error => {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
                );
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

function getTableList(pageIndex: number, pageSize: number): Promise<any> {
    return TableModel.count({})
        .then(
        (count: number) => {
            return TableModel.find({}).sort({ name: -1 })
                .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                .limit(pageSize)
                .populate('userId')
                .then(
                tables => {
                    const response = paginate(tables, count, pageIndex, pageSize);
                    for (const i in response.items) {
                        if (response.items[i]) {
                            response.items[i] = convertTableToResponseObject(response.items[i]);
                        }
                    }
                    return Promise.resolve(response);
                }
                )
                .catch(
                error => {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
                );
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

function getAllTables(): Promise<any> {
    return TableModel.find({}).sort({ name: -1 })
        .populate('userId')
        .then(
        tables => {
            const response = [];
            for (const i in tables) {
                if (tables[i]) {
                    response[i] = convertTableToResponseObject(tables[i]);
                }
            }
            return Promise.resolve(response);
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

function getAllTablesActive() {
    return TableModel.find({ active: true }).sort({ name: 1 })
        .then(
        tables => {
            const response = [];
            for (const i in tables) {
                if (tables[i]) {
                    response[i] = convertTableToResponseObject(tables[i]);
                }
            }
            return Promise.resolve(response);
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

export const tableDao = {
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
