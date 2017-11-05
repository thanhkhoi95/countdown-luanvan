import * as express from 'express';
import { staffController } from '../controllers';

export const staffRouter = express.Router();

staffRouter.route('/').post((req: express.Request, res: express.Response, next: express.NextFunction) => {
    staffController.createStaff(req)
        .then(
        (response) => {
            res.send(response);
        }
        )
        .catch(
        (error) => {
            res.status(error.statusCode).send({
                message: error.message
            });
        }
        );
});
