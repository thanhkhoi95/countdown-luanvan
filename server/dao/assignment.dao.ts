import { AssignmentModel, IAssignment, IAssignmentModel } from '../models';
import { convertStaffToResponseObject as convertStaff, convertTableToResponseObject as convertTable } from '.';
import { paginate } from '../shared';

function convertToResponseObject(assignment) {
    return {
        staff: convertStaff(assignment.staffId),
        table: convertTable(assignment.tableId)
    };
}

function getAssignmentById(assignmentId): Promise<any> {
    return AssignmentModel.findOne({ _id: assignmentId })
        .then((responsedAssignment) => {
            if (responsedAssignment) {
                return responsedAssignment.populate('staffId').populate('tableId').execPopulate()
                    .then((populatedAssignment) => {
                        return Promise.resolve(convertToResponseObject(populatedAssignment));
                    })
                    .catch((error) => {
                        return Promise.reject({
                            statusCode: 500,
                            message: 'Internal server error.'
                        });
                    });
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Assignment not found.'
                });
            }
        })
        .catch((error) => {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            } else {
                return Promise.reject(error);
            }
        });
}

function getAssignmentListByStaffId(staffId: string): Promise<any> {
    return AssignmentModel.find({ staffId: staffId })
        .populate('staffId').populate('tableId')
        .then(
        assignments => {
            const data = [];
            for (const i in assignments) {
                if (assignments[i]) {
                    data[i] = convertToResponseObject(assignments[i]);
                }
            }
            return Promise.resolve(data);
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

function getAssignmentListByTableId(tableId: string): Promise<any> {
    return AssignmentModel.find({ tableId: tableId })
        .populate('staffId').populate('tableId')
        .then(
        assignments => {
            const data = [];
            for (const i in assignments) {
                if (assignments[i]) {
                    data[i] = convertToResponseObject(assignments[i]);
                }
            }
            return Promise.resolve(data);
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

function insertAssignment(assignment: IAssignment): Promise<any> {
    const newAssignment = new AssignmentModel(assignment);
    return newAssignment.save()
        .then(
        (responsedAssignment) => {
            return responsedAssignment.populate('staffId').populate('tableId').execPopulate()
                .then(
                (populatedAssignment) => {
                    return Promise.resolve(convertToResponseObject(populatedAssignment));
                }
                )
                .catch(
                (error) => {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
                );
        })
        .catch(
        (error) => {
            console.log(error);
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        });
}



export const assignmentDao = {
    insertAssignment: insertAssignment
};
