"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var diacritics = require("diacritics");
var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    lowercaseName: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
        required: true
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
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});
categorySchema.pre('save', function (next) {
    this.lowercaseName = diacritics.remove(this.name.toLowerCase());
    next();
});
exports.CategoryModel = mongoose.model('category', categorySchema);
//# sourceMappingURL=category.model.js.map