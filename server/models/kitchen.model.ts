import * as mongoose from 'mongoose';
import * as diacritics from 'diacritics';

export interface IKitchen {
    id?: string;
    name: string;
    lowercaseName?: string;
    userId: string;
    active: boolean;
}

export interface IKitchenModel extends IKitchen, mongoose.Document { }

const kitchenSchema = new mongoose.Schema(
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
kitchenSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

kitchenSchema.pre('remove', function(next) {
    this.model('user').remove({ _id: this.userId }, next);
});

kitchenSchema.pre('save', function(next){
    this.lowercaseName = diacritics.remove(this.name.toLowerCase());
    next();
});

export const KitchenModel = mongoose.model<IKitchenModel>('kitchen', kitchenSchema);
