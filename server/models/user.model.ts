import * as mongoose from 'mongoose';

export interface IUser {
    id?: string;
    username: string;
    role: string[];
    salt: string;
    password: string;
}

export interface IUserModel extends IUser, mongoose.Document { }

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        salt: {
            type: String,
            required: true
        },
        password: {
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
    }
);

// Duplicate the ID field.
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export const UserModel = mongoose.model<IUserModel>('user', userSchema);
