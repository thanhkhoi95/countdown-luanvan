import * as mongoose from 'mongoose';

export interface IStaff {
    id?: string;
    fullname: string;
    birthDate: Date;
    userId: string;
    gender: boolean;
}

export interface IStaffModel extends IStaff, mongoose.Document { }

const staffSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        gender: {
            type: Boolean,
            required: true
        },
        birthDate: {
            type: Date,
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
staffSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export const StaffModel = mongoose.model<IStaffModel>('staff', staffSchema);
