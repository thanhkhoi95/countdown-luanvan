"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
exports.categoryRouter = express.Router();
exports.categoryRouter.route('/').get(function (req, res, next) {
    controllers_1.categoryController.getCategory(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.categoryRouter.route('/').post(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.categoryController.createCategory(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.categoryRouter.route('/setactive').put(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.categoryController.setActiveCategory(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.categoryRouter.route('/').put(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.categoryController.updateCategory(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.categoryRouter.route('/getlist').get(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.categoryController.getCategoryList(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.categoryRouter.route('/getall').get(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.categoryController.getAllCategory(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.categoryRouter.route('/getallactive').get(function (req, res, next) {
    controllers_1.categoryController.getAllCategory(req, true)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
// categoryRouter.route('/').delete((req: express.Request, res: express.Response, next: express.NextFunction) => {
//     categoryController.deleteCategory(req)
//         .then(
//         response => {
//             res.send(response);
//         }
//         )
//         .catch(
//         error => {
//             res.status(error.statusCode).send({
//                 message: error.message
//             });
//         }
//         );
// });
//# sourceMappingURL=category.route.js.map