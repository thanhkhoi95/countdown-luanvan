import * as mongoose from 'mongoose';

export interface IAssignment {
    id?: string;
    staffId: string;
    tableId: string;
}

export interface IAssignmentModel extends IAssignment, mongoose.Document { }

const AssignmentSchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'staff'
        },
        tableId: {
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
AssignmentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export const AssignmentModel = mongoose.model<IAssignmentModel>('assignment', AssignmentSchema);
