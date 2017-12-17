"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uid = require("uid");
var dao_1 = require("../dao");
var crypto = require("crypto");
var config_1 = require("../config");
var rq = require("request");
var app_1 = require("../app");
function addOrder(request) {
    if (!request.body.foods || !request.body.table) {
        return Promise.reject({
            statusCode: 400,
            message: 'Data fields missing.'
        });
    }
    request.body.date = Date.now();
    request.body.status = 'serving';
    var processes = request.body.foods.map(function (item) {
        return dao_1.foodDao.getOriginFood(item.food).then(function (responsedFood) {
            item.price = responsedFood.price;
            item.status = 'ordered';
            item.uid = uid(10);
            return item;
        });
    });
    return Promise.all(processes).then(function () {
        return dao_1.orderDao.createOrder(request.body)
            .then(function (response) {
            return Promise.resolve({
                message: 'Create order successfully.',
                data: {
                    order: response
                }
            });
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: error.statusCode,
                message: error.message
            });
        });
    });
}
function getAllOrders(request) {
    return dao_1.orderDao.getAllOrders()
        .then(function (response) {
        return Promise.resolve({
            message: 'Get orders successfully.',
            data: {
                orders: response
            }
        });
    })
        .catch(function (error) {
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
function getOrderById(request) {
    return dao_1.orderDao.getOrderById(request.query.id)
        .then(function (response) {
        return Promise.resolve({
            message: 'Get order successfully.',
            data: {
                order: response
            }
        });
    })
        .catch(function (err) {
        return Promise.reject({
            statusCode: err.statusCode,
            message: err.message
        });
    });
}
function changeTable(request) {
    return dao_1.orderDao.getOriginOrderById(request.query.id)
        .then(function (responsedOrder) {
        var order = {
            id: request.query.id,
            foods: responsedOrder.foods,
            table: request.body.table || responsedOrder.table,
            status: responsedOrder.status,
            date: responsedOrder.date
        };
        return dao_1.orderDao.updateOrder(order)
            .then(function (response) {
            return Promise.resolve({
                message: 'Update order successfully.',
                data: {
                    order: response
                }
            });
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: error.statusCode,
                message: error.message
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: error.statusCode,
            message: error.message
        });
    });
}
function addMoreFood(request) {
    return dao_1.orderDao.getOriginOrderById(request.query.id)
        .then(function (responsedOrder) {
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
        var processes = request.body.foods.map(function (item) {
            return dao_1.foodDao.getOriginFood(item.food).then(function (responsedFood) {
                item.price = responsedFood.price;
                item.status = 'ordered';
                item.uid = uid(10);
                return item;
            });
        });
        return Promise.all(processes).then(function () {
            var order = {
                id: request.query.id,
                foods: request.body.foods.concat(responsedOrder.foods),
                table: responsedOrder.table,
                date: responsedOrder.date,
                status: 'serving'
            };
            return dao_1.orderDao.updateOrder(order)
                .then(function (response) {
                return Promise.resolve({
                    message: 'Update order successfully.',
                    data: {
                        order: response
                    }
                });
            })
                .catch(function (error) {
                return Promise.reject({
                    statusCode: error.statusCode,
                    message: error.message
                });
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: error.statusCode,
            message: error.message
        });
    });
}
function changeOrderStatus(request) {
    return dao_1.orderDao.getOriginOrderById(request.query.id)
        .then(function (responsedOrder) {
        if (responsedOrder.status === 'checked out') {
            return Promise.reject({
                statusCode: 550,
                message: 'Permission denied'
            });
        }
        var order = {
            id: request.query.id,
            foods: responsedOrder.foods,
            table: responsedOrder.table,
            date: responsedOrder.date,
            status: request.body.status
        };
        if (order.status === 'checked out') {
            dao_1.tableDao.getOriginTable(order.table).then(function (table) {
                table.status = 'available';
                table.save().then(function () { }).catch(function (err) { return console.log(err); });
            }).catch(function (err) { return console.log(err); });
            order.staff = request.body.authInfo.staff.id;
        }
        return dao_1.orderDao.updateOrder(order)
            .then(function (response) {
            return Promise.resolve({
                message: 'Update order successfully.',
                data: {
                    order: response
                }
            });
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: error.statusCode,
                message: error.message
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: error.statusCode,
            message: error.message
        });
    });
}
function changeFoodStatus(request) {
    console.log(request.body);
    return dao_1.orderDao.getOriginOrderById(request.query.id)
        .then(function (responsedOrder) {
        var order = {
            id: request.query.id,
            foods: responsedOrder.foods,
            table: responsedOrder.table,
            date: responsedOrder.date,
            status: responsedOrder.status,
        };
        for (var i in order.foods) {
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
                }
                else if (request.body.status === 'done') {
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
                }
                else if (request.body.status === 'cocking') {
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
                }
                else if (request.body.status === 'ordered') {
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
                }
                else {
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
        return dao_1.orderDao.updateOrder(order)
            .then(function (response) {
            return Promise.resolve({
                message: 'Update order successfully.',
                data: {
                    order: response
                }
            });
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: error.statusCode,
                message: error.message
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: error.statusCode,
            message: error.message
        });
    });
}
function getNewestOrderByTableId(req) {
    return dao_1.orderDao.getOrderByTable(req.query.tableid)
        .then(function (orders) {
        if (orders.length > 0) {
            orders.sort(function (a, b) {
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
        }
        else {
            return Promise.resolve({
                message: 'Get order successfully.',
                data: {
                    order: null
                }
            });
        }
    })
        .catch(function (error) {
        return Promise.reject(error);
    });
}
function onlineCheckout(req) {
    console.log('go go go');
    return dao_1.orderDao.getOrderByTable(req.query.id)
        .then(function (orders) {
        if (orders.length <= 0) {
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid checkout request'
            });
        }
        orders.sort(function (a, b) {
            return b.date - a.date;
        });
        var order = orders[0];
        console.log('go to this');
        if (order.status !== 'serving') {
            console.log('go to this 2');
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid checkout request'
            });
        }
        else {
            var total = 0;
            for (var i = 0; i < order.foods.length; i++) {
                total += order.foods[i].price * order.foods[i].quantity;
            }
            var url = 'http://api.1pay.vn/bank-charging/service/v2?';
            var signature = '';
            signature += 'access_key=' + config_1.default.checkout.access_key;
            signature += '&amount=' + total;
            signature += '&command=request_transaction';
            signature += '&order_id=' + order.id;
            signature += '&order_info=' + 'Thanh_toan_truc_tuyen_nha_hang';
            signature += '&return_url=' + 'http://localhost:6969/api/order/checkoutru';
            url += '' + signature;
            var hmac = crypto.createHmac('SHA256', config_1.default.checkout.secret);
            signature = hmac.update(signature).digest('hex');
            url += '&signature=' + signature;
            console.log(url);
            var options_1 = {
                url: url,
                method: 'POST'
            };
            order.device = req.body.authInfo.role;
            order.status = 'checking out';
            console.log('go to this');
            return dao_1.orderDao.updateOrder(order)
                .then(function () {
                var promise = new Promise(function (resolve, reject) {
                    rq(options_1, function (err, response, body) {
                        if (response && response.statusCode === 200) {
                            resolve(JSON.parse(body));
                        }
                        else {
                            reject({
                                statusCode: 500,
                                message: 'Internal server error'
                            });
                        }
                    });
                });
                return promise;
            })
                .catch(function (err) {
                return Promise.reject(err);
            });
        }
    })
        .catch(function (err) {
        Promise.reject(err);
    });
}
function checkoutReturnUrl(req) {
    var signature = '';
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
    var hmac = crypto.createHmac('SHA256', config_1.default.checkout.secret);
    // if (signature === hmac.update(signature).digest('hex')) {
    return dao_1.orderDao.getOrderById(req.query.order_id)
        .then(function (order) {
        if (parseInt(req.query.response_code, 10) === 0) {
            order.trans_ref = req.query.trans_ref;
            order.status = 'checked out';
            return dao_1.orderDao.updateOrder(order)
                .then(function () {
                app_1.io.to(order.table.id).emit('order:checkout', order);
                return Promise.resolve('http://localhost:4321/welcome');
            })
                .catch(function (err) {
                return Promise.reject(err);
            });
        }
        else {
            order.status = 'serving';
            return dao_1.orderDao.updateOrder(order)
                .then(function () {
                console.log(order);
                if (order.device === 'table') {
                    return Promise.resolve('http://localhost:4321/bill');
                }
                else {
                    return Promise.resolve('http://localhost:4321/staff/bill/' + order.id);
                }
            })
                .catch(function (err) {
                return Promise.reject(err);
            });
        }
    })
        .catch(function (err) {
        Promise.reject(err);
    });
    // }
}
exports.orderController = {
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
//# sourceMappingURL=order.controller.js.map