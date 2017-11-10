import * as express from 'express';
import { uploadImage } from '../middlewares';
import * as multiparty from 'connect-multiparty';

const multipartyMiddleware = multiparty();

export const foodRouter = express.Router();

foodRouter.route('/').post(multipartyMiddleware, uploadImage, (req, res, next) => {
    console.log(req.body.uploadedImages);
    res.send('upload image');
});
