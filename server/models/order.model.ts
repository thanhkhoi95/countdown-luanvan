import * as mongoose from 'mongoose';

interface FoodRef {
    food: string;
    price: number;
    quantity: number;
    uid: string;
    status: string;
    kitchen?: string;
    staff?: string;
}

export interface IOrder {
    id?: string;
    foods: FoodRef[];
    table: string;
    date: Date;
    status: String;
    staff?: string;
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
            kitchen: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'kitchen'
            },
            staff: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'staff'
            }
        }],
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'table'
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'staff'
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
