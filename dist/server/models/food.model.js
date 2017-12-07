"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var diacritics = require("diacritics");
var foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lowercaseName: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    pictures: [String],
    categories: [String],
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
foodSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
foodSchema.pre('save', function (next) {
    this.lowercaseName = diacritics.remove(this.name.toLowerCase());
    next();
});
exports.FoodModel = mongoose.model('food', foodSchema);
//# sourceMappingURL=food.model.js.map