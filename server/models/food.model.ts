import * as mongoose from 'mongoose';
import * as diacritics from 'diacritics';

interface CategoryRef {
    categoryId: string;
}

export interface IFood {
    id?: string;
    name: string;
    lowercaseName?: string;
    avatar?: string;
    description: string;
    price: number;
    pictures: string[];
    categories: CategoryRef[];
    active: boolean;
}

export interface IFoodModel extends IFood, mongoose.Document { }

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        lowercaseName: {
            type: String
        },
        avatar: {
            type: String
        },
        descripttion: {
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
        }],
        active: {
            type: Boolean,
            default: true,
            required: true
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
foodSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

foodSchema.pre('save', function(next){
    this.lowercaseName = diacritics.remove(this.name.toLowerCase());
    next();
});

export const FoodModel = mongoose.model<IFoodModel>('food', foodSchema);
