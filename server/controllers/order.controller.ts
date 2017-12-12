import * as uid from 'uid';
import * as express from 'express';
import { orderDao, foodDao, tableDao } from '../dao';
import { tableController } from '../controllers';
import { IError, ISuccess } from '../shared';
import { IOrder, TableModel } from '../models';
import * as crypto from 'crypto';
import config from '../config';
import * as rq from 'request';
import { io } from '../app';

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
            if (request.body.authInfo.role === 'table') {
                console.log(request.body);
                console.log(responsedOrder);
                if (responsedOrder.table.toString() !== request.body.authInfo._id) {
                    return Promise.reject({
                        statusCode: 550,
                        message: 'Permission denied'
                    });
                }
            }
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
                    status: 'serving'
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
            if (responsedOrder.status === 'checked out') {
                return Promise.reject({
                    statusCode: 550,
                    message: 'Permission denied'
                });
            }
            const order: IOrder = {
                id: request.query.id,
                foods: responsedOrder.foods,
                table: responsedOrder.table,
                date: responsedOrder.date,
                status: request.body.status
            };
            if (order.status === 'checked out') {
                tableDao.getOriginTable(order.table).then(
                    table => {
                        table.status = 'available';
                        table.save().then(() => { }).catch(err => console.log(err));
                    }
                ).catch((err) => console.log(err));
                order.staff = request.body.authInfo.staff.id;
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
    console.log(request.body);
    return orderDao.getOriginOrderById(request.query.id)
        .then((responsedOrder) => {
            const order: IOrder = {
                id: request.query.id,
                foods: responsedOrder.foods,
                table: responsedOrder.table,
                date: responsedOrder.date,
                status: responsedOrder.status,
            };
            for (const i in order.foods) {
                if (order.foods[i].uid === request.body.uid) {
                    if (request.body.status === 'delivered') {
                        console.log(order.foods[i]);
                        if (order.foods[i].status !== 'done') {
                            console.log('---2');
                            return Promise.reject({
                                statusCode: 550,
                                message: 'Permission denied'
                            });
                        }
                        if (!request.body.authInfo.staff) {
                            return Promise.reject({
                                statusCode: 550,
                                message: 'Permission denied'
                            });
                        }
                    } else
                        if (request.body.status === 'done') {
                            console.log(order.foods[i]);
                            if (request.body.authInfo.staff) {
                                if (request.body.authInfo.staff.id !== order.foods[i].staff.toString() &&
                                    order.foods[i].status === 'delivered') {
                                    console.log(1);
                                    return Promise.reject({
                                        statusCode: 550,
                                        message: 'Permission denied'
                                    });
                                }
                            }
                            if (request.body.authInfo.kitchen) {
                                console.log(2);
                                if (order.foods[i].status === 'cocking' &&
                                    order.foods[i].kitchen.toString() !== request.body.authInfo.kitchen.id) {
                                    console.log(3);
                                    return Promise.reject({
                                        statusCode: 550,
                                        message: 'Permission denied'
                                    });
                                }
                                if (order.foods[i].status === 'delivered') {
                                    console.log(4);
                                    return Promise.reject({
                                        statusCode: 550,
                                        message: 'Permission denied'
                                    });
                                }
                            }
                        } else
                            if (request.body.status === 'cocking') {
                                if (request.body.authInfo.staff) {
                                    return Promise.reject({
                                        statusCode: 550,
                                        message: 'Permission denied'
                                    });
                                }
                                if (request.body.authInfo.kitchen) {
                                    if (order.foods[i].status === 'done' &&
                                        order.foods[i].kitchen.toString() !== request.body.authInfo.kitchen.id) {
                                        return Promise.reject({
                                            statusCode: 550,
                                            message: 'Permission denied'
                                        });
                                    }
                                    if (order.foods[i].status === 'delivered') {
                                        console.log('---4');
                                        return Promise.reject({
                                            statusCode: 550,
                                            message: 'Permission denied'
                                        });
                                    }
                                }
                            } else
                                if (request.body.status === 'ordered') {
                                    if (request.body.authInfo.staff) {
                                        return Promise.reject({
                                            statusCode: 550,
                                            message: 'Permission denied'
                                        });
                                    }
                                    if (request.body.authInfo.kitchen) {
                                        if (order.foods[i].status === 'delivered' &&
                                            order.foods[i].kitchen.toString() !== request.body.authInfo.kitchen.id) {
                                            return Promise.reject({
                                                statusCode: 550,
                                                message: 'Permission denied'
                                            });
                                        }
                                    }
                                } else {
                                    return Promise.reject({
                                        statusCode: 400,
                                        message: 'Invalid status'
                                    });
                                }
                    order.foods[i].status = request.body.status;
                    if (request.body.authInfo.kitchen) {
                        order.foods[i].kitchen = request.body.authInfo.kitchen.id;
                    }
                    if (request.body.authInfo.staff) {
                        order.foods[i].staff = request.body.authInfo.staff.id;
                    }
                    break;
                }
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

function getNewestOrderByTableId(req: express.Request): Promise<ISuccess | IError> {
    return orderDao.getOrderByTable(req.query.tableid)
        .then((orders) => {
            if (orders.length > 0) {
                orders.sort((a, b) => {
                    return b.date - a.date;
                });
                if (orders[0].status === 'checked out') {
                    return Promise.resolve({
                        message: 'Get order successfully.',
                        data: {
                            order: null
                        }
                    });
                }
                return Promise.resolve({
                    message: 'Get order successfully.',
                    data: {
                        order: orders[0]
                    }
                });
            } else {
                return Promise.resolve({
                    message: 'Get order successfully.',
                    data: {
                        order: null
                    }
                });
            }
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function onlineCheckout(req: express.Request) {
    console.log('go go go');
    return orderDao.getOrderByTable(req.query.id)
        .then((orders) => {
            if (orders.length <= 0) {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Invalid checkout request'
                });
            }
            orders.sort((a, b) => {
                return b.date - a.date;
            });
            const order = orders[0];
            console.log('go to this');
            if (order.status !== 'serving') {
                console.log('go to this 2');
                return Promise.reject({
                    statusCode: 400,
                    message: 'Invalid checkout request'
                });
            } else {
                let total = 0;
                for (let i = 0; i < order.foods.length; i++) {
                    total += order.foods[i].price * order.foods[i].quantity;
                }
                let url = 'http://api.1pay.vn/bank-charging/service/v2?';
                let signature = '';
                signature += 'access_key=' + config.checkout.access_key;
                signature += '&amount=' + total;
                signature += '&command=request_transaction';
                signature += '&order_id=' + order.id;
                signature += '&order_info=' + 'Thanh_toan_truc_tuyen_nha_hang';
                signature += '&return_url=' + 'http://localhost:6969/api/order/checkoutru';
                url += '' + signature;
                const hmac = crypto.createHmac('SHA256', config.checkout.secret);
                signature = hmac.update(signature).digest('hex');
                url += '&signature=' + signature;
                console.log(url);
                const options = {
                    url: url,
                    method: 'POST'
                };
                order.device = req.body.authInfo.role;
                order.status = 'checking out';
                console.log('go to this');
                return orderDao.updateOrder(order as IOrder)
                    .then(() => {
                        const promise = new Promise<any>((resolve, reject) => {
                            rq(options, (err, response, body) => {
                                if (response && response.statusCode === 200) {
                                    resolve(JSON.parse(body));
                                } else {
                                    reject({
                                        statusCode: 500,
                                        message: 'Internal server error'
                                    });
                                }
                            });
                        });
                        return promise;
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }
        })
        .catch(err => {
            Promise.reject(err);
        });
}

function checkoutReturnUrl(req: express.Request) {
    let signature = '';
    signature += 'access_key=' + req.query.access_key;
    signature += '&amount=' + req.query.amount;
    signature += '&card_name=' + req.query.card_name;
    signature += '&card_type=' + req.query.card_type;
    signature += '&order_id=' + req.query.order_id;
    signature += '&order_info=' + req.query.order_info;
    signature += '&order_type=' + req.query.order_type;
    signature += '&request_time=' + req.query.request_time;
    signature += '&response_code=' + req.query.response_code;
    signature += '&response_message=' + req.query.response_message;
    signature += '&response_time=' + req.query.response_time;
    signature += '&trans_ref=' + req.query.trans_ref;
    signature += '&trans_status=' + req.query.trans_status;
    const hmac = crypto.createHmac('SHA256', config.checkout.secret);
    // if (signature === hmac.update(signature).digest('hex')) {
    return orderDao.getOrderById(req.query.order_id)
        .then((order) => {
            if (parseInt(req.query.response_code, 10) === 0) {
                order.trans_ref = req.query.trans_ref;
                order.status = 'checked out';
                return orderDao.updateOrder(order as IOrder)
                    .then(() => {
                        io.to(order.table.id).emit('order:checkout', order);
                        return Promise.resolve('http://localhost:4321/welcome');
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            } else {
                order.status = 'serving';
                return orderDao.updateOrder(order as IOrder)
                    .then(() => {
                        console.log(order);
                        if (order.device === 'table') {
                            return Promise.resolve('http://localhost:4321/bill');
                        } else {
                            return Promise.resolve('http://localhost:4321/staff/bill/' + order.id);
                        }
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }
        })
        .catch(err => {
            Promise.reject(err);
        });
    // }
}

export const orderController = {
    addOrder: addOrder,
    getOrderById: getOrderById,
    getAllOrders: getAllOrders,
    changeTable: changeTable,
    addMoreFood: addMoreFood,
    changeOrderStatus: changeOrderStatus,
    changeFoodStatus: changeFoodStatus,
    getNewestOrderByTableId: getNewestOrderByTableId,
    onlineCheckout: onlineCheckout,
    checkoutReturnUrl: checkoutReturnUrl
    // updateOrder: updateOrder
};
