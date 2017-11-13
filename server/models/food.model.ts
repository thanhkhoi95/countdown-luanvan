import * as mongoose from 'mongoose';
import * as diacritics from 'diacritics';

export interface IFood {
    id?: string;
    name: string;
    lowercaseName?: string;
    description: string;
    price: number;
    pictures: string[];
    categories: string[];
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
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        pictures: [String],
        categories: [String],
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
