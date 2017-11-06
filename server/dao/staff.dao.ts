import { StaffModel, IStaff, IStaffModel } from '../models';

function convertToResponseObject(staff) {
    return {
        fullname: staff.fullname,
        birthdate: staff.birthdate,
        gender: staff.gender ? 'male' : 'female',
        username: staff.userId.username,
        id: staff.id
    };
}

function insertStaff(staff: IStaff): Promise<any> {
    const newStaff = new StaffModel(staff);
    return newStaff.save()
        .then(
        (responsedStaff) => {
            return responsedStaff.populate('userId').execPopulate().then(
                (populatedStaff: IStaff) => {
                    return Promise.resolve(convertToResponseObject(populatedStaff));
                }
            ).catch(
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
    const updatedStaff = new StaffModel();
    updatedStaff.save();
}

export const staffDao = {
    insertStaff: insertStaff,
    removeStaff: removeStaff
};
