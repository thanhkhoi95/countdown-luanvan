import * as express from 'express';

export const wakeRouter = express.Router();

wakeRouter.route('/').get((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send('wake up');
});
