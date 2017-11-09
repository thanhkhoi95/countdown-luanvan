import { KitchenModel, IKitchen, IKitchenModel } from '../models';
import { paginate } from '../shared';

function convertToResponseObject(kitchen) {
    return {
        name: kitchen.name,
        lowercaseName: kitchen.lowercaseName,
        username: kitchen.userId.username,
        id: kitchen.id,
        role: kitchen.role,
        active: kitchen.active
    };
}

function getPopulatedKitchenById(kitchenId: string): Promise<any> {
    return KitchenModel.findOne({ _id: kitchenId })
        .then(
        (responsedKitchen) => {
            if (responsedKitchen) {
                return responsedKitchen.populate('userId').execPopulate()
                    .then(
                    (populatedKitchen: IKitchen) => {
                        return Promise.resolve(convertToResponseObject(populatedKitchen));
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
                    message: 'Staff not found.'
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

function getPopulatedKitchenByUserId(userId: string): Promise<any> {
    return KitchenModel.findOne({ userId: userId })
        .then(
        (responsedKitchen) => {
            if (responsedKitchen) {
                return responsedKitchen.populate('userId').execPopulate()
                    .then(
                    (populatedKitchen: IKitchen) => {
                        return Promise.resolve(convertToResponseObject(populatedKitchen));
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
                    message: 'Staff not found.'
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

function getOriginKitchen(kitchenId: string): Promise<any> {
    return KitchenModel.findOne({ _id: kitchenId })
        .then(
        (responsedKitchen) => {
            if (responsedKitchen) {
                return Promise.resolve(responsedKitchen);
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Kitchen not found.'
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

function insertKitchen(kitchen: IKitchen): Promise<any> {
    return KitchenModel.findOne({ name: kitchen.name })
        .then(
        (existedKitchen) => {
            if (!existedKitchen) {
                const newKitchen = new KitchenModel(kitchen);
                return newKitchen.save()
                    .then(
                    (responsedKitchen) => {
                        return responsedKitchen.populate('userId').execPopulate()
                            .then(
                            (populatedKitchen: IKitchen) => {
                                return Promise.resolve(convertToResponseObject(populatedKitchen));
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
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Duplicate kitchen name.'
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

function removeKitchen(staffId: string): Promise<any> {
    return KitchenModel.findOne({ _id: staffId })
        .then(
        (responsedKitchen: IKitchenModel) => {
            responsedKitchen.remove()
                .then(
                () => Promise.resolve('Remove kitchen successfully.')
                )
                .catch(
                () => Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                })
                );
        }
        )
        .catch(
        error => Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        })
        );
}

function updateKitchen(kitchen: IKitchen): Promise<any> {
    return KitchenModel.findOne({ _id: kitchen.id })
        .then(
        (responsedKitchen) => {
            responsedKitchen.name = kitchen.name;
            responsedKitchen.active = kitchen.active;
            return responsedKitchen.save()
                .then(
                updatedKitchen => {
                    return updatedKitchen.populate('userId').execPopulate()
                        .then(
                        (populatedKitchen: IKitchen) => {
                            return Promise.resolve(convertToResponseObject(populatedKitchen));
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

function getAllKitchens(pageIndex: number, pageSize: number): Promise<any> {
    return KitchenModel.count({})
        .then(
        (count: number) => {
            return KitchenModel.find({}).sort({ name: -1 })
                .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                .limit(pageSize)
                .populate('userId')
                .then(
                kitchens => {
                    const response = paginate(kitchens, count, pageIndex, pageSize);
                    for (const i in response.items) {
                        if (response.items[i]) {
                            response.items[i] = convertToResponseObject(response.items[i]);
                        }
                    }
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

export const kitchenDao = {
    insertKitchen: insertKitchen,
    removeKitchen: removeKitchen,
    updateKitchen: updateKitchen,
    getOriginKitchen: getOriginKitchen,
    getPopulatedKitchenById: getPopulatedKitchenById,
    getPopulatedKitchenByUserId: getPopulatedKitchenByUserId,
    getAllKitchens: getAllKitchens
};
