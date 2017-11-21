import { OrderModel, IOrder, IOrderModel } from '../models';

function getAllOrders(): Promise<any> {
    return OrderModel.find({}).populate('foods.food')
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
        .then(() => {
            
        })
        .catch(() => {

        });
}

export const orderDao = {
    getAllOrders: getAllOrders
};
