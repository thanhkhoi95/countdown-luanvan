"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var fs = require("fs");
var path = require("path");
exports.imageRouter = express.Router();
exports.imageRouter.route('/:filename').get(function (req, res, next) {
    var filePath = __dirname + '/../upload/' + req.params.filename;
    if (fs.existsSync(filePath)) {
        res.sendFile(path.resolve(filePath));
    }
    else {
        res.sendFile(path.resolve(__dirname + '/../upload/default.png'));
    }
});
//# sourceMappingURL=image.route.js.map