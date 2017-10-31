import * as mongoose from 'mongoose';

interface CategoryRef {
    categoryId: string;
}

export interface IFood {
    id?: string;
    name: string;
    price: number;
    pictures: string[];
    categories: CategoryRef[];
}

export interface IFoodModel extends IFood, mongoose.Document { }

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        pictures: [String],
        categories: [{
            categoryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'category'
            }
        }]
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
foodSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export const FoodModel = mongoose.model<IFoodModel>('food', foodSchema);
