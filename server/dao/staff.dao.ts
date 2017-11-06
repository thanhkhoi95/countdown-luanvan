import { StaffModel, IStaff, IStaffModel } from '../models';

function convertToResponseObject(staff) {
    return {
        fullname: staff.fullname,
        birthdate: staff.birthdate,
        gender: staff.gender ? 'male' : 'female',
        username: staff.userId.username,
        id: staff.id,
        active: staff.active
    };
}

function getPopulatedStaff(staffId: string): Promise<any> {
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
    return StaffModel.findOneAndUpdate({_id: staff.id}, staff)
        .then(
        (responsedStaff) => {
            responsedStaff = new StaffModel(responsedStaff);
            return responsedStaff.populate('userId').execPopulate()
                .then(
                (populatedStaff: IStaff) => {
                    populatedStaff.active = staff.active;
                    populatedStaff.fullname = staff.fullname;
                    populatedStaff.birthdate = staff.birthdate;
                    populatedStaff.gender = staff.gender;
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

export const staffDao = {
    insertStaff: insertStaff,
    removeStaff: removeStaff,
    updatedStaff: updateStaff,
    getOriginStaff: getOriginStaff,
    getPopulatedStaff: getPopulatedStaff
};
