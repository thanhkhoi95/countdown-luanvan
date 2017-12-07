"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var shared_1 = require("../shared");
function convertStaffToResponseObject(staff) {
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
exports.convertStaffToResponseObject = convertStaffToResponseObject;
function getPopulatedStaffById(staffId) {
    return models_1.StaffModel.findOne({ _id: staffId })
        .then(function (responsedStaff) {
        if (responsedStaff) {
            return responsedStaff.populate('userId').execPopulate()
                .then(function (populatedStaff) {
                return Promise.resolve(convertStaffToResponseObject(populatedStaff));
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
                message: 'Staff not found.'
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
function getPopulatedStaffByUserId(userId) {
    return models_1.StaffModel.findOne({ userId: userId })
        .then(function (responsedStaff) {
        if (responsedStaff) {
            return responsedStaff.populate('userId').execPopulate()
                .then(function (populatedStaff) {
                return Promise.resolve(convertStaffToResponseObject(populatedStaff));
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
                message: 'Staff not found.'
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
function getOriginStaff(staffId) {
    return models_1.StaffModel.findOne({ _id: staffId })
        .then(function (responsedStaff) {
        if (responsedStaff) {
            return Promise.resolve(responsedStaff);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Staff not found.'
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
function insertStaff(staff) {
    var newStaff = new models_1.StaffModel(staff);
    return newStaff.save()
        .then(function (responsedStaff) {
        return responsedStaff.populate('userId').execPopulate()
            .then(function (populatedStaff) {
            return Promise.resolve(convertStaffToResponseObject(populatedStaff));
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
function removeStaff(staffId) {
    return models_1.StaffModel.findOne({ _id: staffId })
        .then(function (responsedStaff) {
        responsedStaff.remove()
            .then(function () { return Promise.resolve('Remove staff successfully.'); })
            .catch(function () { return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        }); });
    })
        .catch(function (error) { return Promise.reject({
        statusCode: 500,
        message: 'Internal server error.'
    }); });
}
function updateStaff(staff) {
    return models_1.StaffModel.findOne({ _id: staff.id })
        .then(function (responsedStaff) {
        responsedStaff.firstname = staff.firstname;
        responsedStaff.lastname = staff.lastname;
        responsedStaff.gender = staff.gender;
        responsedStaff.active = staff.active;
        responsedStaff.birthdate = staff.birthdate;
        responsedStaff.avatar = staff.avatar;
        return responsedStaff.save()
            .then(function (updatedStaff) {
            return updatedStaff.populate('userId').execPopulate()
                .then(function (populatedStaff) {
                return Promise.resolve(convertStaffToResponseObject(populatedStaff));
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
function getStaffList(pageIndex, pageSize) {
    return models_1.StaffModel.count({})
        .then(function (count) {
        return models_1.StaffModel.find({}).sort({ firstname: -1 })
            .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
            .limit(pageSize)
            .populate('userId')
            .then(function (staffs) {
            var response = shared_1.paginate(staffs, count, pageIndex, pageSize);
            for (var i in response.items) {
                if (response.items[i]) {
                    response.items[i] = convertStaffToResponseObject(response.items[i]);
                }
            }
            return Promise.resolve(response);
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
function getAllStaffs() {
    return models_1.StaffModel.find({}).sort({ firstname: -1 })
        .populate('userId')
        .then(function (staffs) {
        var response = [];
        for (var i in staffs) {
            if (staffs[i]) {
                response[i] = convertStaffToResponseObject(staffs[i]);
            }
        }
        return Promise.resolve(response);
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
exports.staffDao = {
    insertStaff: insertStaff,
    removeStaff: removeStaff,
    updateStaff: updateStaff,
    getOriginStaff: getOriginStaff,
    getPopulatedStaffById: getPopulatedStaffById,
    getPopulatedStaffByUserId: getPopulatedStaffByUserId,
    getStaffList: getStaffList,
    getAllStaffs: getAllStaffs
};
//# sourceMappingURL=staff.dao.js.map