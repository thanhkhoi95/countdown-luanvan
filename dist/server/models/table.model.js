"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var diacritics = require("diacritics");
var tableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    lowercaseName: {
        type: String
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    status: {
        type: String
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
tableSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
tableSchema.pre('remove', function (next) {
    this.model('user').remove({ _id: this.userId }, next);
});
tableSchema.pre('save', function (next) {
    this.lowercaseName = diacritics.remove(this.name.toLowerCase());
    next();
});
exports.TableModel = mongoose.model('table', tableSchema);
//# sourceMappingURL=table.model.js.map