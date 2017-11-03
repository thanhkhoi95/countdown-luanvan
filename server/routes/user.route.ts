import * as express from 'express';
import { userController } from '../controllers';

export const userRouter = express.Router();

userRouter.route('/').put(userController.changePassword);
