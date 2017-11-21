import * as mongoose from 'mongoose';

interface FoodRef {
    food: string;
    price: number;
    quantity: number;
    uid: string;
    status: String;
}

export interface IOrder {
    id?: string;
    foods: FoodRef[];
    table: string;
    date: Date;
    status: String;
}

export interface IOrderModel extends IOrder, mongoose.Document { }

const orderSchema = new mongoose.Schema(
    {
        foods: [{
            uid: {
                type: String,
                required: true
            },
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
            },
            price: {
                type: Number
            },
            quantity: {
                type: Number
            },
            status: {
                type: String
            },
        }],
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'table'
        },
        date: {
            type: Date
        },
        status: {
            type: String
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
