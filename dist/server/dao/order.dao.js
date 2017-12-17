"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
function getAllOrders() {
    return models_1.OrderModel.find({}).populate('foods.food')
        .populate('foods.kitchen')
        .populate('foods.staff')
        .populate('table')
        .then(function (orders) {
        return Promise.resolve(orders);
    })
        .catch(function () {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error'
        });
    });
}
function createOrder(order) {
    var newOrder = new models_1.OrderModel(order);
    return newOrder.save()
        .then(function (responsedOrder) {
        return responsedOrder.populate('foods.food')
            .populate('foods.kitchen')
            .populate('foods.staff')
            .populate('table')
            .execPopulate()
            .then(function (populatedOrder) {
            return Promise.resolve(populatedOrder);
        })
            .catch(function (error) {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error'
            });
        });
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error'
        });
    });
}
function updateOrder(order) {
    return models_1.OrderModel.findOne({ _id: order.id })
        .then(function (responsedOrder) {
        responsedOrder.foods = order.foods;
        responsedOrder.table = order.table;
        responsedOrder.status = order.status;
        responsedOrder.device = order.device;
        responsedOrder.trans_ref = order.trans_ref;
        responsedOrder.staff = order.staff;
        return responsedOrder.save()
            .then(function (updatedOrder) {
            return updatedOrder.populate('foods.food')
                .populate('foods.kitchen')
                .populate('foods.staff')
                .populate('table')
                .execPopulate()
                .then(function (populatedOrder) {
                return Promise.resolve(populatedOrder);
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
    })
        .catch(function (error) {
        return Promise.reject({
            statusCode: 500,
            message: 'Internal server error.'
        });
    });
}
function getOrderById(orderId) {
    return models_1.OrderModel.findOne({ _id: orderId }).populate('foods.food')
        .populate('foods.kitchen')
        .populate('foods.staff')
        .populate('table')
        .then(function (order) {
        if (order) {
            return Promise.resolve(order);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Order not found.'
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
function getOriginOrderById(orderId) {
    return models_1.OrderModel.findOne({ _id: orderId })
        .then(function (order) {
        if (order) {
            return Promise.resolve(order);
        }
        else {
            return Promise.reject({
                statusCode: 400,
                message: 'Order not found.'
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
function getOrderByTable(tableId) {
    return models_1.OrderModel.find({ table: tableId }).populate('foods.food')
        .populate('foods.kitchen')
        .populate('foods.staff')
        .populate('table')
        .then(function (orders) {
        return Promise.resolve(orders);
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
exports.orderDao = {
    getAllOrders: getAllOrders,
    createOrder: createOrder,
    updateOrder: updateOrder,
    getOrderById: getOrderById,
    getOriginOrderById: getOriginOrderById,
    getOrderByTable: getOrderByTable
};
//# sourceMappingURL=order.dao.js.map