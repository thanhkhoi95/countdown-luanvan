import * as mongoose from 'mongoose';

interface FoodRef {
    foodId: string;
    name: string;
    price: number;
    numb: number;
    date: Date;
}

export interface IOrder {
    id?: string;
    foods: FoodRef[];
    tableId: string;
    clientName: string;
}

export interface IOrderModel extends IOrder, mongoose.Document { }

const orderSchema = new mongoose.Schema(
    {
        foods: [{
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
            },
            price: {
                type: Number
            },
            numb: {
                type: Number
            }
        }],
        tableId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'table'
        },
        date: {
            type: Date
        }
    },
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
);

// Duplicate the ID field.
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export const OrderModel = mongoose.model<IOrderModel>('order', orderSchema);
