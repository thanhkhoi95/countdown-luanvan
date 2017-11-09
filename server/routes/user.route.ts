import * as express from 'express';
import { userController } from '../controllers';
import { parseJwt } from '../middlewares';

export const userRouter = express.Router();

userRouter.route('/password').put(parseJwt('staffEx'), (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
