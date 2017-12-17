"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dao_1 = require("../dao");
function createCategory(request) {
    if (!request.body.name) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    var newCategory = {
        name: request.body.name,
        active: true
    };
    return dao_1.categoryDao.insertCategory(newCategory)
        .then(function (responsedCategory) {
        return Promise.resolve({
            message: 'Create new category successfully.',
            data: {
                category: responsedCategory
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
function setActiveCategory(request) {
    return dao_1.categoryDao.getCategory(request.query.id)
        .then(function (responsedCategory) {
        var category = {
            id: request.query.id,
            name: responsedCategory.name,
            active: request.query.state
        };
        return dao_1.categoryDao.updateCategory(category)
            .then(function (deactivatedCategory) {
            return Promise.resolve({
                message: 'Deactivate category successfully.',
                data: {
                    category: deactivatedCategory
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
function getCategory(request) {
    return dao_1.categoryDao.getCategory(request.query.id)
        .then(function (response) { return Promise.resolve({
        message: 'Get category successfully.',
        data: {
            category: response
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
function updateCategory(request) {
    return dao_1.categoryDao.getCategory(request.query.id)
        .then(function (responsedCategory) {
        var category = {
            id: request.query.id,
            name: request.body.name || responsedCategory.name,
            active: responsedCategory.active
        };
        return dao_1.categoryDao.updateCategory(category)
            .then(function (updatedCategory) {
            return Promise.resolve({
                message: 'Update category successfully.',
                data: {
                    category: updatedCategory
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
function getCategoryList(request) {
    if (!request.query.pageindex) {
        request.query.pageindex = '1';
    }
    if (!request.query.pagesize) {
        request.query.pagesize = '20';
    }
    return dao_1.categoryDao.getCategoryList(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
        .then(function (response) { return Promise.resolve({
        message: 'Get categories successfully.',
        data: {
            categories: response
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
function getAllCategory(request, active) {
    if (!active) {
        return dao_1.categoryDao.getAllCategories()
            .then(function (response) { return Promise.resolve({
            message: 'Get categories successfully.',
            data: {
                categories: response
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
        return dao_1.categoryDao.getAllCategoriesActive()
            .then(function (response) { return Promise.resolve({
            message: 'Get categories successfully.',
            data: {
                categories: response
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
exports.categoryController = {
    createCategory: createCategory,
    setActiveCategory: setActiveCategory,
    getCategory: getCategory,
    updateCategory: updateCategory,
    getCategoryList: getCategoryList,
    getAllCategory: getAllCategory
};
//# sourceMappingURL=category.controller.js.map