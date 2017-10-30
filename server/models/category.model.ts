import * as mongoose from 'mongoose';

export interface ICategory {
    id?: string;
    name: string;
}

export interface ICategoryModel extends ICategory, mongoose.Document { }

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
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
    });
// Duplicate the ID field.
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export const CategoryModel = mongoose.model<ICategoryModel>('User', categorySchema);
