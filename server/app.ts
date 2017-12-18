import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';

import { wakeRouter } from './routes/wake.route';

const app = express();
const server = http.createServer(app);
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 6969));
app.set('baseUri', '/api');



app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

app.use(morgan('dev'));

app.use(`/api/wake`, wakeRouter);


if (!module.parent) {
    server.listen(app.get('port'), () => {
        console.log('Luanvan web service listening on port ' + app.get('port'));
    });
}

const login = require('facebook-chat-api');

setInterval(() => {
    login({ appState: JSON.parse(fs.readFileSync('./appstate.json', 'utf8')) }, (err, api) => {
        if (err) {
            return console.error(err);
        }

        const msg = {
            body: ''
        };

        const bc = 1513641600000;
        let hh = '';
        let mm = '';
        let ss = '';

        const now = Date.now();
        const countdown = Math.floor((bc - now) / 1000);
        const h = Math.floor(countdown / 3600);
        if (h < 10) {
            hh = '0' + h.toString();
        } else {
            hh = h.toString();
        }
        const m = Math.floor(countdown / 60) - 60 * h;
        if (m < 10) {
            mm = '0' + m.toString();
        } else {
            mm = m.toString();
        }
        const s = countdown - Math.floor(countdown / 60) * 60;
        if (s < 10) {
            ss = '0' + m.toString();
        } else {
            ss = m.toString();
        }
        msg.body = 'Còn ' + hh + ':' + mm + ':' + ss + ' nữa là tới giờ quẫy òy mấy má ới...';
        api.sendMessage(msg, '1155353634510429');

    });
}, 3600000);

setInterval(function () {
    http.get('http://countdown-luanvan.herokuapp.com/api/wake');
}, 300000);
