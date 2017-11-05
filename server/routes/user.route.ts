import * as express from 'express';
import { userController } from '../controllers';

export const userRouter = express.Router();

userRouter.route('/password').put((req: express.Request, res: express.Response, next: express.NextFunction) => {
    userController.changePassword(req)
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
