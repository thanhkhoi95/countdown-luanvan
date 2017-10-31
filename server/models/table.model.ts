import * as mongoose from 'mongoose';

export interface ITable {
    id?: string;
    name: string;
    userId: string;
}

export interface ITableModel extends ITable, mongoose.Document { }

const tableSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
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
tableSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export const TableModel = mongoose.model<ITableModel>('table', tableSchema);
