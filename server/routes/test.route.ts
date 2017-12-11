import * as express from 'express';
import { authController } from '../controllers';

export const testRouter = express.Router();

testRouter.route('/').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.send(`<body>
        <script>
            setTimeout(function(){
                document.location.replace('http://localhost:4200');
            }, 500);
        </script>
     </body>`);
    }
);
