"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
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
    },
    role: {
        type: String,
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
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.UserModel = mongoose.model('user', userSchema);
//# sourceMappingURL=user.model.js.map