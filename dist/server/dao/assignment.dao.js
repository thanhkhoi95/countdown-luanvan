"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var _1 = require(".");
function convertToResponseObject(assignment) {
    return {
        id: assignment.id,
        staff: _1.convertStaffToResponseObject(assignment.staff),
        table: _1.convertTableToResponseObject(assignment.table)
    };
}
function getOriginAssignment(assignmentId) {
    return models_1.AssignmentModel.findOne({ _id: assignmentId })
        .then(function (responsedAssignment) {
        if (responsedAssignment) {
            return Promise.resolve(responsedAssignment);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Assignment not found.'
            });
        }
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
function getAssignmentById(assignmentId) {
    return models_1.AssignmentModel.findOne({ _id: assignmentId })
        .then(function (responsedAssignment) {
        if (responsedAssignment) {
            return responsedAssignment.populate('staff').populate('table').execPopulate()
                .then(function (populatedAssignment) {
                return Promise.resolve(convertToResponseObject(populatedAssignment));
            })
                .catch(function (error) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            });
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Assignment not found.'
            });
        }
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
function getAssignmentListByStaffId(staffId) {
    return models_1.AssignmentModel.find({ staff: staffId })
        .populate('staff').populate('table')
        .then(function (assignments) {
        var data = [];
        for (var i in assignments) {
            if (assignments[i]) {
                data[i] = convertToResponseObject(assignments[i]);
            }
        }
        return Promise.resolve(data);
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getAssignmentActiveListByStaffId(staffId) {
    return models_1.AssignmentModel.find({ staff: staffId })
        .populate('staff').populate('table')
        .then(function (assignments) {
        var data = [];
        for (var i = 0; i < assignments.length; i++) {
            if (assignments[i]) {
                data[i] = convertToResponseObject(assignments[i]);
                if (data[i].table.active === false) {
                    assignments.splice(i, 1);
                    data.splice(i, 1);
                    i--;
                }
            }
        }
        return Promise.resolve(data);
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getAssignmentListByTableId(tableId) {
    return models_1.AssignmentModel.find({ tableId: tableId })
        .populate('staff').populate('table')
        .then(function (assignments) {
        var data = [];
        for (var i in assignments) {
            if (assignments[i]) {
                data[i] = convertToResponseObject(assignments[i]);
            }
        }
        return Promise.resolve(data);
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function insertAssignment(assignment) {
    var newAssignment = new models_1.AssignmentModel(assignment);
    return newAssignment.save()
        .then(function (responsedAssignment) {
        return responsedAssignment.populate('staff').populate('table').execPopulate()
            .then(function (populatedAssignment) {
            return Promise.resolve(convertToResponseObject(populatedAssignment));
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function updateAssignment(assignment) {
    return models_1.AssignmentModel.findOne({ _id: assignment.id })
        .then(function (responsedAssignment) {
        responsedAssignment.staff = assignment.staff;
        responsedAssignment.table = assignment.table;
        return responsedAssignment.save()
            .then(function (updatedAssignment) {
            return updatedAssignment.populate('staff').populate('table').execPopulate()
                .then(function (populatedAssignment) {
                return Promise.resolve(convertToResponseObject(populatedAssignment));
            })
                .catch(function (error) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            });
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function deleteAssignment(assignmentId) {
    return models_1.AssignmentModel.findOneAndRemove({ _id: assignmentId })
        .then(function () {
        return Promise.resolve({});
    })
        .catch(function () {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
exports.assignmentDao = {
    insertAssignment: insertAssignment,
    getAssignmentById: getAssignmentById,
    getAssignmentListByStaffId: getAssignmentListByStaffId,
    getAssignmentActiveListByStaffId: getAssignmentActiveListByStaffId,
    getAssignmentListByTableId: getAssignmentListByTableId,
    updateAssignment: updateAssignment,
    deleteAssignment: deleteAssignment,
    getOriginAssignment: getOriginAssignment
};
//# sourceMappingURL=assignment.dao.js.map