import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

const pub = fs.readFileSync(path.join(__dirname, '../key.pem'));
const key = fs.readFileSync(path.join(__dirname, '../key.rsa'));

export function tokenSign(obj: object, callback): void {
    jwt.sign(obj, key, { algorithm: 'RS256', expiresIn: '1d' }, (err, token) => {
        if (err) {
            callback(err);
        } else {
            callback(null, token);
        }
    });
}

export function tokenVerify(token: string, callback): void {
    jwt.verify(token, pub, (err, decoded) => {
        if (err) {
            callback(err);
        } else {
            callback(null, decoded);
        }
    });
}
