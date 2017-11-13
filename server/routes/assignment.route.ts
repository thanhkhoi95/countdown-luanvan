import * as express from 'express';
import { assignmentController } from '../controllers';
import { parseJwt } from '../middlewares';

export const assignmentRouter = express.Router();

assignmentRouter.route('/').post(
    parseJwt('admin'),
    (req, res, next) => {
        assignmentController.createAssignment(req)
            .then((response) => {
                res.send(response);
            })
            .catch((error) => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            });
    }
);

assignmentRouter.route('/').put(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        assignmentController.updateAssignment(req)
            .then(
            response => {
                res.send(response);
            }
            )
            .catch(
            error => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

assignmentRouter.route('/staff').get(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        assignmentController.getAssignmentListByStaffId(req)
            .then(
            response => {
                res.send(response);
            }
            )
            .catch(
            error => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

assignmentRouter.route('/table').get(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        assignmentController.getAssignmentListByTableId(req)
            .then(
            response => {
                res.send(response);
            }
            )
            .catch(
            error => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

assignmentRouter.route('/').delete(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
    assignmentController.deleteAssignment(req)
        .then(
        response => {
            res.send(response);
        }
        )
        .catch(
        error => {
            res.status(error.statusCode).send({
                message: error.message
            });
        }
        );
});
