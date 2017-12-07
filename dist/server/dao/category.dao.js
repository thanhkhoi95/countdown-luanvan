"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var shared_1 = require("../shared");
function getCategory(categoryId) {
    return models_1.CategoryModel.findOne({ _id: categoryId })
        .then(function (responsedCategory) {
        if (responsedCategory) {
            return Promise.resolve(responsedCategory);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Category not found.'
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
function insertCategory(category) {
    return models_1.CategoryModel.findOne({ name: category.name })
        .then(function (existedCategory) {
        if (!existedCategory) {
            var newCategory = new models_1.CategoryModel(category);
            return newCategory.save()
                .then(function (responsedTable) {
                return Promise.resolve(responsedTable);
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
                message: 'Duplicate category name.'
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
function updateCategory(category) {
    return models_1.CategoryModel.findOne({ _id: category.id })
        .then(function (responsedCategory) {
        responsedCategory.name = category.name;
        responsedCategory.active = category.active;
        return responsedCategory.save()
            .then(function (updatedCategory) {
            return Promise.resolve(updatedCategory);
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
function getCategoryList(pageIndex, pageSize) {
    return models_1.CategoryModel.count({})
        .then(function (count) {
        return models_1.CategoryModel.find({}).sort({ name: -1 })
            .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
            .limit(pageSize)
            .then(function (tables) {
            var response = shared_1.paginate(tables, count, pageIndex, pageSize);
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
function getAllCategories() {
    return models_1.CategoryModel.find({}).sort({ name: -1 })
        .then(function (tables) {
        return Promise.resolve(tables);
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getAllCategoriesActive() {
    return models_1.CategoryModel.find({ active: true }).sort({ name: 1 })
        .then(function (tables) {
        return Promise.resolve(tables);
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
exports.categoryDao = {
    insertCategory: insertCategory,
    updateCategory: updateCategory,
    getCategory: getCategory,
    getCategoryList: getCategoryList,
    getAllCategories: getAllCategories,
    getAllCategoriesActive: getAllCategoriesActive
};
//# sourceMappingURL=category.dao.js.map