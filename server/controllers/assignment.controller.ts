import * as express from 'express';
import { IError, ISuccess, cryptoUtils } from '../shared';
import { userDao, assignmentDao } from '../dao';
import { IAssignment } from '../models';

function createAssignment(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body.staffId || !request.body.tableId) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    const newAssignment: IAssignment = {
        staffId: request.body.staffId,
        tableId: request.body.tableId
    };
    return assignmentDao.insertAssignment(newAssignment)
        .then(
        (responsedAssignment) => {
            return Promise.resolve({
                message: 'Create new assignment successfully.',
                data: {
                    assignment: responsedAssignment
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

function getAssignmentById(request: express.Request): Promise<ISuccess | IError> {
    return assignmentDao.getAssignmentById(request.query.id)
        .then(
        (response) => Promise.resolve({
            message: 'Get assignment successfully.',
            data: {
                assignment: response
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

function updateAssignment(request: express.Request): Promise<ISuccess | IError> {
    return assignmentDao.getOriginAssignment(request.query.id)
        .then(
        (responsedAssignment) => {
            const assignment: IAssignment = {
                id: request.query.id,
                staffId: request.body.staffId || responsedAssignment.staffId,
                tableId: request.body.tableId || responsedAssignment.tableId,
            };
            return assignmentDao.updateAssignment(assignment)
                .then(
                (updatedAssignment) => {
                    return Promise.resolve({
                        message: 'Update assignment successfully.',
                        data: {
                            assignment: updatedAssignment
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

function getAssignmentListByStaffId(request: express.Request): Promise<ISuccess | IError> {
    return assignmentDao.getAssignmentListByStaffId(request.query.staffId)
        .then(
        (response) => Promise.resolve({
            message: 'Get assignments successfully.',
            data: {
                assignments: response
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

function getAssignmentListByTableId(request: express.Request): Promise<ISuccess | IError> {
    return assignmentDao.getAssignmentListByTableId(request.query.staffId)
        .then(
        (response) => Promise.resolve({
            message: 'Get assignments successfully.',
            data: {
                assignments: response
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

function deleteAssignment(request: express.Request): Promise<ISuccess | IError> {
    return assignmentDao.deleteAssignment(request.query.id)
        .then(
        () => Promise.resolve({
            message: 'Delete assignment successfully.',
            data: {}
        })
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

export const assignmentController = {
    createAssignment: createAssignment,
    getAssignmentById: getAssignmentById,
    updateAssignment: updateAssignment,
    getAssignmentListByStaffId: getAssignmentListByStaffId,
    getAssignmentListByTableId: getAssignmentListByTableId,
    deleteAssignment: deleteAssignment
};
