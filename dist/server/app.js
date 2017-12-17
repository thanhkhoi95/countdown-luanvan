"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var express = require("express");
var morgan = require("morgan");
var path = require("path");
var http = require("http");
var app = express();
var server = http.createServer(app);
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
if (!module.parent) {
    server.listen(app.get('port'), function () {
        console.log('Luanvan web service listening on port ' + app.get('port'));
    });
}
var login = require('facebook-chat-api');
// Create simple echo bot
login({ email: 'vacc.no2@gmail.com', password: '4271845khoi' }, function (err, api) {
    if (err) {
        return console.error(err);
    }
    var msg = {
        body: ''
    };
    var bc = 1513641600000;
    var hh = '';
    var mm = '';
    var ss = '';
    var now = Date.now();
    var countdown = Math.floor((bc - now) / 1000);
    var h = Math.floor(countdown / 3600);
    if (h < 10) {
        hh = '0' + h.toString();
    }
    else {
        hh = h.toString();
    }
    var m = Math.floor(countdown / 60) - 60 * h;
    if (m < 10) {
        mm = '0' + m.toString();
    }
    else {
        mm = m.toString();
    }
    var s = countdown - Math.floor(countdown / 60) * 60;
    if (s < 10) {
        ss = '0' + m.toString();
    }
    else {
        ss = m.toString();
    }
    msg.body = 'Còn ' + h + ':' + m + ':' + s + ' nữa là tới giờ quẫy òy mấy má ới...';
    api.sendMessage(msg, '1155353634510429');
    setInterval(function () {
        now = Date.now();
        countdown = Math.floor((bc - now) / 1000);
        h = Math.floor(countdown / 3600);
        m = Math.floor(countdown / 60) - 60 * h;
        s = countdown - Math.floor(countdown / 60) * 60;
        msg.body = 'Còn ' + h + ':' + m + ':' + s + ' nữa là tới giờ quẫy òy mấy má ới...';
        api.sendMessage(msg, '1155353634510429');
    }, 3600000);
});
//# sourceMappingURL=app.js.map