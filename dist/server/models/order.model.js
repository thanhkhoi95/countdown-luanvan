"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var orderSchema = new mongoose.Schema({
    foods: [{
            uid: {
                type: String,
                required: true
            },
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
            },
            price: {
                type: Number
            },
            quantity: {
                type: Number
            },
            status: {
                type: String
            },
        }],
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'table'
    },
    date: {
        type: Date
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
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.OrderModel = mongoose.model('order', orderSchema);
//# sourceMappingURL=order.model.js.map