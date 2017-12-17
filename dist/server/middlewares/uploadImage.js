"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function uploadImage(req, res, next) {
    req.body.uploadedImages = [];
    var fileId;
    var pathUpload;
    var flag = true;
    for (var fileName in req.files) {
        if (fileName) {
            if (req.files[fileName].type !== 'image/png' && req.files[fileName].type !== 'image/jpeg') {
                res.status(400).send({
                    message: 'File\'s type mismatch!'
                });
                flag = false;
                break;
            }
            fileId = Date.now() + path.extname(req.files[fileName].name);
            pathUpload = __dirname + '/../upload/' + fileId;
            try {
                var data = fs.readFileSync(req.files[fileName].path);
                fs.writeFileSync(pathUpload, data);
                req.body.uploadedImages.push(fileId);
            }
            catch (error) {
                rollbackUploadedFiles(req.body.uploadedImages);
                res.status(500).send({
                    message: 'Upload image error.'
                });
                flag = false;
                break;
            }
        }
    }
    for (var f in req.files) {
        if (f) {
            try {
                fs.unlinkSync(req.files[f].path);
            }
            catch (err) { }
        }
    }
    if (flag) {
        next();
    }
}
exports.uploadImage = uploadImage;
function rollbackUploadedFiles(files) {
    var fileId;
    var pathUpload;
    for (var fileName in files) {
        if (fileName) {
            fileId = files[fileName];
            pathUpload = __dirname + '/../upload/' + fileId;
            try {
                fs.unlinkSync(pathUpload);
            }
            catch (err) { }
        }
    }
}
exports.rollbackUploadedFiles = rollbackUploadedFiles;
//# sourceMappingURL=uploadImage.js.map