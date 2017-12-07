"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
exports.assignmentRouter = express.Router();
exports.assignmentRouter.route('/').post(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.assignmentController.createAssignment(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.assignmentRouter.route('/').put(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.assignmentController.updateAssignment(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.assignmentRouter.route('/staff').get(function (req, res, next) {
    controllers_1.assignmentController.getAssignmentListByStaffId(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.assignmentRouter.route('/staffactive').get(
// parseJwt('staff'),
function (req, res, next) {
    controllers_1.assignmentController.getAssignmentListByStaffId(req, true)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.assignmentRouter.route('/table').get(function (req, res, next) {
    controllers_1.assignmentController.getAssignmentListByTableId(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.assignmentRouter.route('/').delete(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.assignmentController.deleteAssignment(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
//# sourceMappingURL=assignment.route.js.map