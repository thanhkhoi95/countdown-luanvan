import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

export function uploadImage(req, res: express.Response, next: express.NextFunction) {
    req.body.uploadedImages = [];
    let fileId: string;
    let pathUpload: string;
    let flag = true;
    for (const fileName in req.files) {
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
                const data = fs.readFileSync(req.files[fileName].path);
                fs.writeFileSync(pathUpload, data);
                req.body.uploadedImages.push(fileId);
            } catch (error) {
                rollbackUploadedFiles(req.body.uploadedImages);
                res.status(500).send({
                    message: 'Upload image error.'
                });
                flag = false;
                break;
            }
        }
    }

    for (const f in req.files) {
        if (f) {
            try {
                fs.unlinkSync(req.files[f].path);
            } catch (err) { }
        }
    }

    if (flag) {
        next();
    }
}

export function rollbackUploadedFiles(files) {
    let fileId: string;
    let pathUpload: string;
    for (const fileName in files) {
        if (fileName) {
            fileId = files[fileName];
            pathUpload = __dirname + '/../upload/' + fileId;
            try {
                fs.unlinkSync(pathUpload);
            } catch (err) { }
        }
    }
}
