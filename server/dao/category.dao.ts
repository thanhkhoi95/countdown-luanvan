import { CategoryModel, ICategory, ICategoryModel } from '../models';
import { paginate } from '../shared';

function getCategory(categoryId: string): Promise<any> {
    return CategoryModel.findOne({ _id: categoryId })
        .then(
        (responsedCategory) => {
            if (responsedCategory) {
                return Promise.resolve(responsedCategory);
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Category not found.'
                });
            }
        }
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

function insertCategory(category: ICategory): Promise<any> {
    return CategoryModel.findOne({ name: category.name })
        .then(
        (existedCategory) => {
            if (!existedCategory) {
                const newCategory = new CategoryModel(category);
                return newCategory.save()
                    .then(
                    (responsedTable) => {
                        return Promise.resolve(responsedTable);
                    }
                    )
                    .catch(
                    error => {
                        return Promise.reject({
                            statusCode: 500,
                            message: 'Internal server error.'
                        });
                    }
                    );
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Duplicate category name.'
                });
            }
        }
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

function updateCategory(category: ICategory): Promise<any> {
    return CategoryModel.findOne({ _id: category.id })
        .then(
        (responsedCategory) => {
            responsedCategory.name = category.name;
            responsedCategory.active = category.active;
            return responsedCategory.save()
                .then(
                updatedCategory => {
                    return Promise.resolve(updatedCategory);
                }
                )
                .catch(
                error => {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
                );
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

function getAllCategories(pageIndex: number, pageSize: number): Promise<any> {
    return CategoryModel.count({})
        .then(
        (count: number) => {
            return CategoryModel.find({}).sort({ name: -1 })
                .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                .limit(pageSize)
                .populate('userId')
                .then(
                tables => {
                    const response = paginate(tables, count, pageIndex, pageSize);
                    return Promise.resolve(response);
                }
                )
                .catch(
                error => {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error.'
                    });
                }
                );
        }
        )
        .catch(
        error => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error.'
            });
        }
        );
}

export const categoryDao = {
    insertCategory: insertCategory,
    updateCategory: updateCategory,
    getCategory: getCategory,
    getAllCategories: getAllCategories
};
