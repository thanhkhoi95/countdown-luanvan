import * as express from 'express';
import { IError, ISuccess, cryptoUtils } from '../shared';
import { userDao, categoryDao } from '../dao';
import { ICategory } from '../models';

function createCategory(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body.name) {
        return Promise.reject({
            statusCode: 404,
            message: 'Data fields missing.'
        });
    }
    const newCategory: ICategory = {
        name: request.body.name,
        active: true
    };
    return categoryDao.insertCategory(newCategory)
        .then(
        (responsedCategory) => {
            return Promise.resolve({
                message: 'Create new category successfully.',
                data: {
                    staff: responsedCategory
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

function setActiveCategory(request: express.Request): Promise<ISuccess | IError> {
    return categoryDao.getCategory(request.query.id)
        .then(
        (responsedCategory) => {
            const category: ICategory = {
                id: request.query.id,
                name: responsedCategory.name,
                active: request.query.state
            };
            return categoryDao.updateCategory(category)
                .then(
                (deactivatedCategory) => {
                    return Promise.resolve({
                        message: 'Deactivate category successfully.',
                        data: {
                            category: deactivatedCategory
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

function getCategory(request: express.Request): Promise<ISuccess | IError> {
    return categoryDao.getCategory(request.query.id)
        .then(
        (response) => Promise.resolve({
            message: 'Get category successfully.',
            data: {
                table: response
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

function updateCategory(request: express.Request): Promise<ISuccess | IError> {
    return categoryDao.getCategory(request.query.id)
        .then(
        (responsedCategory) => {
            const category: ICategory = {
                id: request.query.id,
                name: request.body.name || responsedCategory.name,
                active: responsedCategory.active
            };
            return categoryDao.updateCategory(category)
                .then(
                (updatedCategory) => {
                    return Promise.resolve({
                        message: 'Update category successfully.',
                        data: {
                            category: updatedCategory
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

function getCategoryList(request: express.Request): Promise<ISuccess | IError> {
    if (!request.query.pageindex) {
        request.query.pageindex = '1';
    }
    if (!request.query.pagesize) {
        request.query.pagesize = '20';
    }
    return categoryDao.getAllCategories(parseInt(request.query.pageindex, 10), parseInt(request.query.pagesize, 10))
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

export const categoryController = {
    createCategory: createCategory,
    setActiveCategory: setActiveCategory,
    getCategory: getCategory,
    updateCategory: updateCategory,
    getCategoryList: getCategoryList
};
