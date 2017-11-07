import { TableModel, ITable, ITableModel } from '../models';
import { paginate } from '../shared';

function convertToResponseObject(table) {
    return {
        name: table.name,
        lowercaseName: table.lowercaseName,
        username: table.userId.username,
        id: table.id,
        role: table.role,
        active: table.active
    };
}

function getPopulatedTableById(tableId: string): Promise<any> {
    return TableModel.findOne({ _id: tableId })
        .then(
        (responsedTable) => {
            if (responsedTable) {
                return responsedTable.populate('userId').execPopulate()
                    .then(
                    (populatedTable: ITable) => {
                        return Promise.resolve(convertToResponseObject(populatedTable));
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
                    message: 'Staff not found.'
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
                return responsedTable.populate('userId').execPopulate()
                    .then(
                    (populatedTable: ITable) => {
                        return Promise.resolve(convertToResponseObject(populatedTable));
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
                    message: 'Staff not found.'
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

function insertTable(staff: IStaff): Promise<any> {
    const newStaff = new StaffModel(staff);
    return newStaff.save()
        .then(
        (responsedStaff) => {
            return responsedStaff.populate('userId').execPopulate()
                .then(
                (populatedStaff: IStaff) => {
                    return Promise.resolve(convertToResponseObject(populatedStaff));
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

function removeStaff(staffId: string): Promise<any> {
    return StaffModel.findOne({ _id: staffId })
        .then(
        (responsedStaff: IStaffModel) => {
            responsedStaff.remove()
                .then(
                () => Promise.resolve('Remove staff successfully.')
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

function updateStaff(staff: IStaff): Promise<any> {
    return StaffModel.findOne({ _id: staff.id })
        .then(
        (responsedStaff) => {
            responsedStaff.firstname = staff.firstname;
            responsedStaff.lastname = staff.lastname;
            responsedStaff.gender = staff.gender;
            responsedStaff.active = staff.active;
            responsedStaff.birthdate = staff.birthdate;
            return responsedStaff.save()
                .then(
                updatedStaff => {
                    return updatedStaff.populate('userId').execPopulate()
                        .then(
                        (populatedStaff: IStaff) => {
                            return Promise.resolve(convertToResponseObject(populatedStaff));
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

function getAllStaffs(pageIndex: number, pageSize: number): Promise<any> {
    return StaffModel.count({})
        .then(
        (count: number) => {
            return StaffModel.find({}).sort({ firstname: -1 })
                .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                .limit(pageSize)
                .populate('userId')
                .then(
                staffs => {
                    const response = paginate(staffs, count, pageIndex, pageSize);
                    for (const i in response.items) {
                        if (response.items[i]) {
                            response.items[i] = convertToResponseObject(response.items[i]);
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

export const staffDao = {
    insertStaff: insertStaff,
    removeStaff: removeStaff,
    updatedStaff: updateStaff,
    getOriginStaff: getOriginStaff,
    getPopulatedStaffById: getPopulatedStaffById,
    getPopulatedStaffByUserId: getPopulatedStaffByUserId,
    getAllStaffs: getAllStaffs
};
