"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controllers_1 = require("../controllers");
exports.authRouter = express.Router();
exports.authRouter.route('/login').post(function (req, res, next) {
    controllers_1.authController.login(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.authRouter.route('/tablelogin').post(function (req, res, next) {
    controllers_1.authController.tableLogin(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
//# sourceMappingURL=auth.route.js.map