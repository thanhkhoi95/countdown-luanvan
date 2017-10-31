import * as mongoose from 'mongoose';

interface FoodRef {
    foodId: string;
}

export interface IOrder {
    id?: string;
    foods: FoodRef[];
    tableId: string;
}

export interface IOrderModel extends IOrder, mongoose.Document { }

const orderSchema = new mongoose.Schema(
    {
        foods: [{
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
            }
        }],
        tableId: {
            tpye: mongoose.Schema.Types.ObjectId,
            ref: 'table'
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
