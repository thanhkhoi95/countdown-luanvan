import * as express from 'express';
import { authController } from '../controllers';

export const authRouter = express.Router();

authRouter.route('/login').post(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        authController.login(req)
            .then(
            (response) => {
                res.send(response);
            })
            .catch(
            (error) => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            });
    }
);
