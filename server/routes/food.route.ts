import * as express from 'express';
import * as multiparty from 'connect-multiparty';
import { uploadImage } from '../middlewares';
import { foodController } from '../controllers';

const multipartyMiddleware = multiparty();

export const foodRouter = express.Router();

foodRouter.route('/').post(multipartyMiddleware, uploadImage, (req, res, next) => {
    foodController.createFood(req).then(
        (a) => {
            res.send(a);
        }
    ).catch(
        (a) => {
            res.status(400).send(a);
        }
    );
});
