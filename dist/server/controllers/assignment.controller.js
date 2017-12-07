"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dao_1 = require("../dao");
function createAssignment(request) {
    if (!request.body.staff || !request.body.table) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    var newAssignment = {
        staff: request.body.staff,
        table: request.body.table
    };
    return dao_1.assignmentDao.insertAssignment(newAssignment)
        .then(function (responsedAssignment) {
        return Promise.resolve({
            message: 'Create new assignment successfully.',
            data: {
                assignment: responsedAssignment
            }
        });
    })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
function getAssignmentById(request) {
    return dao_1.assignmentDao.getAssignmentById(request.query.id)
        .then(function (response) { return Promise.resolve({
        message: 'Get assignment successfully.',
        data: {
            assignment: response
        }
    }); })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
function updateAssignment(request) {
    return dao_1.assignmentDao.getOriginAssignment(request.query.id)
        .then(function (responsedAssignment) {
        var assignment = {
            id: request.query.id,
            staff: request.body.staff || responsedAssignment.staff,
            table: request.body.table || responsedAssignment.table,
        };
        return dao_1.assignmentDao.updateAssignment(assignment)
            .then(function (updatedAssignment) {
            return Promise.resolve({
                message: 'Update assignment successfully.',
                data: {
                    assignment: updatedAssignment
                }
            });
        })
            .catch(function (error) {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
function getAssignmentListByStaffId(request, active) {
    if (!active) {
        return dao_1.assignmentDao.getAssignmentListByStaffId(request.query.staffId)
            .then(function (response) { return Promise.resolve({
            message: 'Get assignments successfully.',
            data: {
                assignments: response
            }
        }); })
            .catch(function (error) {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    }
    else {
        return dao_1.assignmentDao.getAssignmentActiveListByStaffId(request.query.id)
            .then(function (response) { return Promise.resolve({
            message: 'Get assignments successfully.',
            data: {
                assignments: response
            }
        }); })
            .catch(function (error) {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    }
}
function getAssignmentListByTableId(request) {
    return dao_1.assignmentDao.getAssignmentListByTableId(request.query.staffId)
        .then(function (response) { return Promise.resolve({
        message: 'Get assignments successfully.',
        data: {
            assignments: response
        }
    }); })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
function deleteAssignment(request) {
    return dao_1.assignmentDao.deleteAssignment(request.query.id)
        .then(function () { return Promise.resolve({
        message: 'Delete assignment successfully.',
        data: {}
    }); })
        .catch(function (error) {
        if (!error.statusCode) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
exports.assignmentController = {
    createAssignment: createAssignment,
    getAssignmentById: getAssignmentById,
    updateAssignment: updateAssignment,
    getAssignmentListByStaffId: getAssignmentListByStaffId,
    getAssignmentListByTableId: getAssignmentListByTableId,
    deleteAssignment: deleteAssignment
};
//# sourceMappingURL=assignment.controller.js.map