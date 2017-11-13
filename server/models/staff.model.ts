import * as mongoose from 'mongoose';
import * as diacritics from 'diacritics';

export interface IStaff {
    id?: string;
    firstname: string;
    lowercaseFirstname?: string;
    lastname: string;
    lowercaseLastname?: string;
    avatar?: string;
    birthdate: Date;
    userId: string;
    gender: boolean;
    active: boolean;
}

export interface IStaffModel extends IStaff, mongoose.Document { }

const staffSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lowercaseFirstname: {
            type: String
        },
        lowercaseLastname: {
            type: String
        },
        lastname: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
            ref: 'user'
        },
        gender: {
            type: Boolean,
            required: true
        },
        birthdate: {
            type: Date,
            required: true
        },
        active: {
            type: Boolean,
            required: true,
            default: true
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
staffSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

staffSchema.pre('remove', function(next) {
    this.model('user').remove({ _id: this.userId }, next);
});

staffSchema.pre('save', function(next){
    this.lowercaseFirstname = diacritics.remove(this.firstname.toLowerCase());
    this.lowercaseLastname = diacritics.remove(this.lastname.toLowerCase());
    next();
});

export const StaffModel = mongoose.model<IStaffModel>('staff', staffSchema);
