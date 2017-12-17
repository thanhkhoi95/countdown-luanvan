"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var multiparty = require("connect-multiparty");
var middlewares_1 = require("../middlewares");
var controllers_1 = require("../controllers");
var middlewares_2 = require("../middlewares");
var multipartyMiddleware = multiparty();
exports.foodRouter = express.Router();
exports.foodRouter.route('/').get(function (req, res, next) {
    controllers_1.foodController.getFood(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.foodRouter.route('/').post(middlewares_1.parseJwt('admin'), multipartyMiddleware, middlewares_1.uploadImage, function (req, res, next) {
    controllers_1.foodController.createFood(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        middlewares_2.rollbackUploadedFiles(req.body.uploadedImages);
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.foodRouter.route('/').put(middlewares_1.parseJwt('admin'), multipartyMiddleware, middlewares_1.uploadImage, function (req, res, next) {
    controllers_1.foodController.updateFood(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        middlewares_2.rollbackUploadedFiles(req.body.uploadedImages);
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.foodRouter.route('/setactive').put(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.foodController.setActiveFood(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.foodRouter.route('/getlist').get(function (req, res, next) {
    controllers_1.foodController.getFoodList(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.foodRouter.route('/getall').get(function (req, res, next) {
    controllers_1.foodController.getAllFood(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.foodRouter.route('/getallactive').get(function (req, res, next) {
    controllers_1.foodController.getAllFood(req, true)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
//# sourceMappingURL=food.route.js.map