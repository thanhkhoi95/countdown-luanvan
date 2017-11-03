import * as mongoose from 'mongoose';

interface FoodRef {
    foodId: string;
    name: string;
    price: number;
    numb: number;
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
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
            },
            name: {
                type: String
            },
            price: {
                type: Number
            },
            numb: {
                type: Number
            }
        }],
        tableId: {
            tpye: mongoose.Schema.Types.ObjectId,
            ref: 'table'
        },
        clientName: {
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

export const OrderModel = mongoose.model<IOrderModel>('food', orderSchema);
