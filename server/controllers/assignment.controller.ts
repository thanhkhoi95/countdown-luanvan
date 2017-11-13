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

function getAssignmentList(request: express.Request): Promise<ISuccess | IError> {
    if (!request.query.pageindex) {
        request.query.pageindex = '1';
    }
    if (!request.query.pagesize) {
        request.query.pagesize = '20';
    }
    return assignmentDao.getAllCategories(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
        .then(
        (response) => Promise.resolve({
            message: 'Get categories successfully.',
            data: {
                categories: response
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

export const assignmentController = {
    createAssignment: createAssignment,
    setActiveAssignment: setActiveAssignment,
    getAssignment: getAssignment,
    updateAssignment: updateAssignment,
    getAssignmentList: getAssignmentList
};
