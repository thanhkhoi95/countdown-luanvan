import * as mongoose from 'mongoose';
import * as diacritics from 'diacritics';

export interface ITable {
    id?: string;
    name: string;
    lowercaseName?: string;
    userId: string;
    active: boolean;
}

export interface ITableModel extends ITable, mongoose.Document { }

const tableSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        lowercaseName: {
            type: String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            unique: true
        },
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
tableSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

tableSchema.pre('remove', function(next) {
    this.model('user').remove({ _id: this.userId }, next);
});

tableSchema.pre('save', function(next){
    this.lowercaseName = diacritics.remove(this.name.toLowerCase());
    next();
});

export const TableModel = mongoose.model<ITableModel>('table', tableSchema);
