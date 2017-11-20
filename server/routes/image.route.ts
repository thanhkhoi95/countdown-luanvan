import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const imageRouter = express.Router();

imageRouter.route('/:filename').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const filePath = __dirname + '/../upload/' + req.params.filename;
        if (fs.existsSync(filePath)) {
            res.sendFile(path.resolve(filePath));
        } else {
            res.sendFile(path.resolve(__dirname + '/../upload/default.png'));
        }
    }
);
