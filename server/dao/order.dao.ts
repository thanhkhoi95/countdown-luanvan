import { OrderModel, IOrder, IOrderModel } from '../models';

function getAllOrders(): Promise<any> {
    return OrderModel.find({}).populate('foods.food')
        .populate('foods.kitchen')
        .populate('foods.staff')
        .populate('table')
        .then((orders) => {
            return Promise.resolve(orders);
        })
        .catch(() => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error'
            });
        });
}

function createOrder(order: IOrder): Promise<any> {
    const newOrder = new OrderModel(order);
    return newOrder.save()
        .then((responsedOrder) => {
            return responsedOrder.populate('foods.food')
                .populate('foods.kitchen')
                .populate('foods.staff')
                .populate('table')
                .execPopulate()
                .then((populatedOrder) => {
                    return Promise.resolve(populatedOrder);
                })
                .catch((error) => {
                    return Promise.reject({
                        statusCode: 500,
                        message: 'Internal server error'
                    });
                });
        })
        .catch((error) => {
            return Promise.reject({
                statusCode: 500,
                message: 'Internal server error'
            });
        });
}

function updateOrder(order: IOrder): Promise<any> {
    return OrderModel.findOne({ _id: order.id })
        .then(
        (responsedOrder) => {
            responsedOrder.foods = order.foods;
            responsedOrder.table = order.table;
            responsedOrder.status = order.status;
            return responsedOrder.save()
                .then(
                updatedOrder => {
                    return updatedOrder.populate('foods.food')
                        .populate('foods.kitchen')
                        .populate('foods.staff')
                        .populate('table')
                        .execPopulate()
                        .then(
                        (populatedOrder) => {
                            return Promise.resolve(populatedOrder);
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

function getOrderById(orderId: string): Promise<any> {
    return OrderModel.findOne({ _id: orderId }).populate('foods.food')
        .populate('foods.kitchen')
        .populate('foods.staff')
        .populate('table')
        .then((order) => {
            if (order) {
                return Promise.resolve(order);
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Order not found.'
                });
            }
        })
        .catch((error) => {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            } else {
                return Promise.reject(error);
            }
        });
}

function getOriginOrderById(orderId: string): Promise<any> {
    return OrderModel.findOne({ _id: orderId })
        .then((order) => {
            if (order) {
                return Promise.resolve(order);
            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Order not found.'
                });
            }
        })
        .catch((error) => {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            } else {
                return Promise.reject(error);
            }
        });
}

function getOrderByTable(tableId: string): Promise<any> {
    return OrderModel.find({ table: tableId }).populate('foods.food')
        .populate('foods.kitchen')
        .populate('foods.staff')
        .populate('table')
        .then((orders) => {
            return Promise.resolve(orders);
        })
        .catch((error) => {
            if (!error.statusCode) {
                return Promise.reject({
                    statusCode: 500,
                    message: 'Internal server error.'
                });
            } else {
                return Promise.reject(error);
            }
        });
}

export const orderDao = {
    getAllOrders: getAllOrders,
    createOrder: createOrder,
    updateOrder: updateOrder,
    getOrderById: getOrderById,
    getOriginOrderById: getOriginOrderById,
    getOrderByTable: getOrderByTable
};
