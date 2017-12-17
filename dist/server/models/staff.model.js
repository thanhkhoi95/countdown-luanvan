"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var diacritics = require("diacritics");
var staffSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lowercaseFirstname: {
        type: String
    },
    lowercaseLastname: {
        type: String
    },
    lastname: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'user'
    },
    gender: {
        type: Boolean,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
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
staffSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
staffSchema.pre('remove', function (next) {
    this.model('user').remove({ _id: this.userId }, next);
});
staffSchema.pre('save', function (next) {
    this.lowercaseFirstname = diacritics.remove(this.firstname.toLowerCase());
    this.lowercaseLastname = diacritics.remove(this.lastname.toLowerCase());
    next();
});
exports.StaffModel = mongoose.model('staff', staffSchema);
//# sourceMappingURL=staff.model.js.map