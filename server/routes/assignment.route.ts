import * as express from 'express';
import { assignmentController } from '../controllers';

export const assignmentRouter = express.Router();

assignmentRouter.route('/').post(
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
