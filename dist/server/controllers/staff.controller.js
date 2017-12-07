"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var dao_1 = require("../dao");
var middlewares_1 = require("../middlewares");
function createStaff(request) {
    if (!request.body.username || !request.body.password ||
        !request.body.firstname || !request.body.lastname ||
        !request.body.birthdate || !request.body.gender) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    var passwordObject = shared_1.cryptoUtils.hashWithSalt(request.body.password);
    var newUser = {
        username: request.body.username,
        password: passwordObject.password,
        salt: passwordObject.salt,
        role: 'staff'
    };
    return dao_1.userDao.insertUser(newUser)
        .then(function (responsedUser) {
        var newStaff = {
            birthdate: request.body.birthdate,
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            gender: request.body.gender,
            userId: responsedUser.id,
            active: true
        };
        if (request.body.uploadedImages.length > 0) {
            newStaff.avatar = request.body.uploadedImages[0];
        }
        return dao_1.staffDao.insertStaff(newStaff)
            .then(function (responsedStaff) {
            return Promise.resolve({
                message: 'Create new staff successfully.',
                data: {
                    staff: responsedStaff
                }
            });
        })
            .catch(function (error) {
            dao_1.userDao.deleteUser(responsedUser.username).then(function () { }).catch(function () { });
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
// function deleteStaff(request: express.Request): Promise<ISuccess | IError> {
//     return staffDao.removeStaff(request.query.id)
//         .then(
//         () => Promise.resolve({
//             message: 'Delete staff successfully.',
//             data: {}
//         })
//         )
//         .catch(
//         (error) => {
//             if (!error.statusCode) {
//                 return Promise.reject({
//                     statusCode: 500,
//                     message: 'Internal server error.'
//                 });
//             } else {
//                 return Promise.reject(error);
//             }
//         }
//         );
// }
function setActiveStaff(request) {
    return dao_1.staffDao.getOriginStaff(request.query.id)
        .then(function (responsedStaff) {
        var staff = {
            id: request.query.id,
            firstname: responsedStaff.firstname,
            lastname: responsedStaff.lastname,
            birthdate: responsedStaff.birthdate,
            gender: responsedStaff.gender,
            userId: responsedStaff.userId,
            avatar: responsedStaff.avatar,
            active: request.query.state
        };
        return dao_1.staffDao.updateStaff(staff)
            .then(function (deactivatedStaff) {
            return Promise.resolve({
                message: 'Deactivate staff successfully.',
                data: {
                    staff: deactivatedStaff
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
function getStaff(request) {
    return dao_1.staffDao.getPopulatedStaffById(request.query.id)
        .then(function (response) { return Promise.resolve({
        message: 'Get staff successfully.',
        data: {
            staff: response
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
function updateAvatar(request) {
    if (request.body.uploadedImages.length < 0) {
        return Promise.reject({
            statusCode: 400,
            message: 'Invalid image.'
        });
    }
    return dao_1.staffDao.getOriginStaff(request.query.id)
        .then(function (responsedStaff) {
        if (request.body.gender === undefined) {
            request.body.gender = responsedStaff.gender;
        }
        var oldAvatar = responsedStaff.avatar;
        var staff = {
            id: request.query.id,
            firstname: responsedStaff.firstname,
            lastname: responsedStaff.lastname,
            birthdate: responsedStaff.birthdate,
            gender: responsedStaff.birthdate,
            userId: responsedStaff.birthdate,
            active: responsedStaff.birthdate,
            avatar: request.body.uploadedImages[0]
        };
        return dao_1.staffDao.updateStaff(staff)
            .then(function (updatedStaff) {
            middlewares_1.rollbackUploadedFiles([oldAvatar]);
            return Promise.resolve({
                message: 'Update avatar successfully.',
                data: {
                    staff: updatedStaff
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
function updateStaff(request) {
    return dao_1.staffDao.getOriginStaff(request.query.id)
        .then(function (responsedStaff) {
        if (request.body.gender === undefined) {
            request.body.gender = responsedStaff.gender;
        }
        var staff = {
            id: request.query.id,
            firstname: request.body.firstname || responsedStaff.firstname,
            lastname: request.body.lastname || responsedStaff.lastname,
            birthdate: request.body.birthdate || responsedStaff.birthdate,
            gender: request.body.gender,
            userId: responsedStaff.userId,
            active: responsedStaff.active,
            avatar: responsedStaff.avatar
        };
        return dao_1.staffDao.updateStaff(staff)
            .then(function (updatedStaff) {
            return Promise.resolve({
                message: 'Update staff successfully.',
                data: {
                    staff: updatedStaff
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
function getStaffList(request) {
    if (!request.query.pageindex) {
        request.query.pageindex = '1';
    }
    if (!request.query.pagesize) {
        request.query.pagesize = '20';
    }
    return dao_1.staffDao.getStaffList(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
        .then(function (response) { return Promise.resolve({
        message: 'Get staffs successfully.',
        data: {
            staffs: response
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
function getAllStaffs(request) {
    return dao_1.staffDao.getAllStaffs()
        .then(function (response) { return Promise.resolve({
        message: 'Get staffs successfully.',
        data: {
            staffs: response
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
exports.staffController = {
    createStaff: createStaff,
    setActiveStaff: setActiveStaff,
    getStaff: getStaff,
    updateStaff: updateStaff,
    updateAvatar: updateAvatar,
    getStaffList: getStaffList,
    getAllStaffs: getAllStaffs
};
//# sourceMappingURL=staff.controller.js.map