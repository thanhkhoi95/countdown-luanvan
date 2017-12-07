"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uid = require("uid");
var dao_1 = require("../dao");
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
                status: 'ordered'
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
        var order = {
            id: request.query.id,
            foods: responsedOrder.foods,
            table: responsedOrder.table,
            date: responsedOrder.date,
            status: request.body.status || request.body.status
        };
        if (order.status === 'checked out') {
            dao_1.tableDao.getOriginTable(order.table).then(function (table) {
                table.status = 'available';
                table.save().then(function () { }).catch(function (err) { return console.log(err); });
            }).catch(function (err) { return console.log(err); });
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
        console.log(responsedOrder);
        var order = {
            id: request.query.id,
            foods: responsedOrder.foods,
            table: responsedOrder.table,
            date: responsedOrder.date,
            status: responsedOrder.status,
        };
        for (var i in order.foods) {
            if (order.foods[i].uid === request.body.uid) {
                order.foods[i].status = request.body.status;
                break;
            }
        }
        console.log(order);
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
    return dao_1.tableDao.getOriginTable(req.query.tableid)
        .then(function (table) {
        return dao_1.orderDao.getOrderByTable(table.id)
            .then(function (orders) {
            orders.sort(function (a, b) {
                return b.date - a.date;
            });
            console.log(orders[0]);
            return Promise.resolve({
                message: 'Get order successfully.',
                data: {
                    order: orders[0]
                }
            });
        })
            .catch(function (error) {
            return Promise.reject(error);
        });
    })
        .catch(function (error) { return Promise.reject(error); });
}
exports.orderController = {
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
//# sourceMappingURL=order.controller.js.map