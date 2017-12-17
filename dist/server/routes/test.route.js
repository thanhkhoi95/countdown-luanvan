"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
exports.testRouter = express.Router();
exports.testRouter.route('/').get(function (req, res, next) {
    res.send("<body>\n        <script>\n            setTimeout(function(){\n                document.location.replace('http://localhost:4200');\n            }, 500);\n        </script>\n     </body>");
});
//# sourceMappingURL=test.route.js.map