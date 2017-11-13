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

export const assignmentController = {
    createAssignment: createAssignment
};
