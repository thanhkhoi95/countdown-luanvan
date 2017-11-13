import { StaffModel, IStaff, IStaffModel } from '../models';
import { paginate } from '../shared';

function convertToResponseObject(staff) {
    return {
        firstname: staff.firstname,
        lowercaseFirstname: staff.lowercaseFirstname,
        lastname: staff.lastname,
        lowercaseLastname: staff.lowercaseLastname,
        birthdate: staff.birthdate,
        gender: staff.gender ? 'male' : 'female',
        avatar: staff.avatar,
        username: staff.userId.username,
        id: staff.id || '',
        role: staff.role,
        active: staff.active
    };
}

function getPopulatedStaffById(staffId: string): Promise<any> {
    return StaffModel.findOne({ _id: staffId })
        .then(
        (responsedStaff) => {
            if (responsedStaff) {
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

function getPopulatedStaffByUserId(userId: string): Promise<any> {
    return StaffModel.findOne({ userId: userId })
        .then(
        (responsedStaff) => {
            if (responsedStaff) {
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

function getOriginStaff(staffId: string): Promise<any> {
    return StaffModel.findOne({ _id: staffId })
        .then(
        (responsedStaff) => {
            if (responsedStaff) {
                return Promise.resolve(responsedStaff);
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

function insertStaff(staff: IStaff): Promise<any> {
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
            responsedStaff.avatar = staff.avatar;
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
    updateStaff: updateStaff,
    getOriginStaff: getOriginStaff,
    getPopulatedStaffById: getPopulatedStaffById,
    getPopulatedStaffByUserId: getPopulatedStaffByUserId,
    getAllStaffs: getAllStaffs
};
