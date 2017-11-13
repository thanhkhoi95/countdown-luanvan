import { AssignmentModel, IAssignment, IAssignmentModel } from '../models';
import { convertStaffToResponseObject as convertStaff, convertTableToResponseObject as convertTable } from '.';

function convertToResponseObject(assignment) {
    return {
        staff: convertStaff(assignment.staffId),
        table: convertTable(assignment.tableId)
    };
}

function getAssignmentById(assignmentId) {
    
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
