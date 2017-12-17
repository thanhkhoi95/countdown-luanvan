"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var diacritics = require("diacritics");
var kitchenSchema = new mongoose.Schema({
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
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
// Duplicate the ID field.
kitchenSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
kitchenSchema.pre('remove', function (next) {
    this.model('user').remove({ _id: this.userId }, next);
});
kitchenSchema.pre('save', function (next) {
    this.lowercaseName = diacritics.remove(this.name.toLowerCase());
    next();
});
exports.KitchenModel = mongoose.model('kitchen', kitchenSchema);
//# sourceMappingURL=kitchen.model.js.map