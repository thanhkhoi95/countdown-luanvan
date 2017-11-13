import * as mongoose from 'mongoose';

export interface ILogin {
    id?: string;
    userId: string;
    socketId: string;
}

export interface ILoginModel extends ILogin, mongoose.Document { }

const LoginSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'staff'
        },
        socketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'table'
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
LoginSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export const AssignmentModel = mongoose.model<ILoginModel>('login', LoginSchema);
