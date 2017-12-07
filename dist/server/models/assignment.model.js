"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var AssignmentSchema = new mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'table'
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
// Duplicate the ID field.
AssignmentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.AssignmentModel = mongoose.model('assignment', AssignmentSchema);
//# sourceMappingURL=assignment.model.js.map