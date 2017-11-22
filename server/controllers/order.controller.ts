import * as uid from 'uid';
import * as express from 'express';
import { orderDao, foodDao, tableDao } from '../dao';
import { tableController } from '../controllers';
import { IError, ISuccess } from '../shared';
import { IOrder, TableModel } from '../models';

function addOrder(request: express.Request): Promise<ISuccess | IError> {
    if (!request.body.foods || !request.body.table) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    request.body.date = Date.now();
    request.body.status = 'serving';

    const processes: Promise<any>[] = request.body.foods.map(item => {
        return foodDao.getOriginFood(item.food).then(responsedFood => {
            item.price = responsedFood.price;
            item.status = 'ordered';
            item.uid = uid(10);
            return item;
        });
    });

    return Promise.all(processes).then(() => {
        return orderDao.createOrder(request.body)
            .then((response) => {
                return Promise.resolve({
                    message: 'Create order successfully.',
                    data: {
                        order: response
                    }
                });
            })
            .catch((error) => {
                return Promise.reject({
                    statusCode: error.statusCode,
                    message: error.message
                });
            });
    });
}

function getAllOrders(request: express.Request): Promise<ISuccess | IError> {
    return orderDao.getAllOrders()
        .then((response) => {
            return Promise.resolve({
                message: 'Get orders successfully.',
                data: {
                    orders: response
                }
            });
        })
        .catch((error) => {
            return Promise.reject({
                statusCode: error.statusCode,
                message: error.message
            });
        });
}

// function updateOrder(request: express.Request): Promise<ISuccess | IError> {
//     return orderDao.getOriginOrderById(request.body.id)
//         .then((responsedOrder) => {
//             const order: IOrder = {
//                 id: request.body.id,
//                 foods: request.body.foods || responsedOrder.foods,
//                 table: request.body.table || responsedOrder.table,
//                 status: request.body.status || responsedOrder.status,
//                 date: responsedOrder.date
//             };
//             return orderDao.updateOrder(order)
//                 .then((response) => {
//                     return Promise.resolve({
//                         message: 'Update order successfully.',
//                         data: {
//                             order: response
//                         }
//                     });
//                 })
//                 .catch((error) => {
//                     return Promise.reject({
//                         statusCode: error.statusCode,
//                         message: error.message
//                     });
//                 });
//         })
//         .catch((error) => {
//             return Promise.reject({
//                 statusCode: error.statusCode,
//                 message: error.message
//             });
//         });
// }

function getOrderById(request: express.Request): Promise<ISuccess | IError> {
    return orderDao.getOrderById(request.query.id)
        .then((response) => {
            return Promise.resolve({
                message: 'Get order successfully.',
                data: {
                    order: response
                }
            });
        })
        .catch((err) => {
            return Promise.reject({
                statusCode: err.statusCode,
                message: err.message
            });
        });
}

function changeTable(request: express.Request): Promise<ISuccess | IError> {
    return orderDao.getOriginOrderById(request.query.id)
        .then((responsedOrder) => {
            const order: IOrder = {
                id: request.query.id,
                foods: responsedOrder.foods,
                table: request.body.table || responsedOrder.table,
                status: responsedOrder.status,
                date: responsedOrder.date
            };
            return orderDao.updateOrder(order)
                .then((response) => {
                    return Promise.resolve({
                        message: 'Update order successfully.',
                        data: {
                            order: response
                        }
                    });
                })
                .catch((error) => {
                    return Promise.reject({
                        statusCode: error.statusCode,
                        message: error.message
                    });
                });
        })
        .catch((error) => {
            return Promise.reject({
                statusCode: error.statusCode,
                message: error.message
            });
        });
}

function addMoreFood(request: express.Request): Promise<ISuccess | IError> {
    return orderDao.getOriginOrderById(request.query.id)
        .then((responsedOrder) => {
            const processes: Promise<any>[] = request.body.foods.map(item => {
                return foodDao.getOriginFood(item.food).then(responsedFood => {
                    item.price = responsedFood.price;
                    item.status = 'ordered';
                    item.uid = uid(10);
                    return item;
                });
            });
            return Promise.all(processes).then(() => {
                const order: IOrder = {
                    id: request.query.id,
                    foods: [...request.body.foods, ...responsedOrder.foods],
                    table: responsedOrder.table,
                    date: responsedOrder.date,
                    status: 'ordered'
                };
                return orderDao.updateOrder(order)
                    .then((response) => {
                        return Promise.resolve({
                            message: 'Update order successfully.',
                            data: {
                                order: response
                            }
                        });
                    })
                    .catch((error) => {
                        return Promise.reject({
                            statusCode: error.statusCode,
                            message: error.message
                        });
                    });
            });
        })
        .catch((error) => {
            return Promise.reject({
                statusCode: error.statusCode,
                message: error.message
            });
        });
}

function changeOrderStatus(request: express.Request): Promise<ISuccess | IError> {
    return orderDao.getOriginOrderById(request.query.id)
        .then((responsedOrder) => {
            const order: IOrder = {
                id: request.query.id,
                foods: responsedOrder.foods,
                table: responsedOrder.table,
                date: responsedOrder.date,
                status: request.body.status || request.body.status
            };
            if (order.status === 'checked out') {
                tableDao.getOriginTable(order.table).then(
                    table => {
                        table.status = 'available';
                        table.save().then(() => { }).catch(err => console.log(err));
                    }
                ).catch((err) => console.log(err));
            }
            return orderDao.updateOrder(order)
                .then((response) => {
                    return Promise.resolve({
                        message: 'Update order successfully.',
                        data: {
                            order: response
                        }
                    });
                })
                .catch((error) => {
                    return Promise.reject({
                        statusCode: error.statusCode,
                        message: error.message
                    });
                });

        })
        .catch((error) => {
            return Promise.reject({
                statusCode: error.statusCode,
                message: error.message
            });
        });
}

function changeFoodStatus(request: express.Request): Promise<ISuccess | IError> {
    return orderDao.getOriginOrderById(request.query.id)
        .then((responsedOrder) => {
            console.log(responsedOrder);
            const order: IOrder = {
                id: request.query.id,
                foods: responsedOrder.foods,
                table: responsedOrder.table,
                date: responsedOrder.date,
                status: responsedOrder.status,
            };
            for (const i in order.foods) {
                if (order.foods[i].uid === request.body.uid) {
                    order.foods[i].status = request.body.status;
                    break;
                }
            }
            console.log(order);
            return orderDao.updateOrder(order)
                .then((response) => {
                    return Promise.resolve({
                        message: 'Update order successfully.',
                        data: {
                            order: response
                        }
                    });
                })
                .catch((error) => {
                    return Promise.reject({
                        statusCode: error.statusCode,
                        message: error.message
                    });
                });

        })
        .catch((error) => {
            return Promise.reject({
                statusCode: error.statusCode,
                message: error.message
            });
        });
}

function getNewestOrderByTableId(req: express.Request): Promise<ISuccess | IError> {
    return tableDao.getOriginTable(req.query.tableid)
        .then((table) => {
            if (table && table.status === 'serving') {
                return orderDao.getAllOrders()
                    .then((orders) => {
                        orders.sort((a, b) => {
                            return b.date - a.date;
                        });
                        return Promise.resolve({
                            message: 'Get order successfully.',
                            data: {
                                order: orders[0]
                            }
                        });
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    });
            }
        })
        .catch(error => Promise.reject(error));
}

export const orderController = {
    addOrder: addOrder,
    getOrderById: getOrderById,
    getAllOrders: getAllOrders,
    changeTable: changeTable,
    addMoreFood: addMoreFood,
    changeOrderStatus: changeOrderStatus,
    changeFoodStatus: changeFoodStatus,
    getNewestOrderByTableId: getNewestOrderByTableId
    // updateOrder: updateOrder
};
