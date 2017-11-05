import * as crypto from 'crypto';

function hashWithSalt(content: string, salt?: string) {
    if (!salt) {
        salt = genRandomString(16);
    }
    const hashContent = crypto.pbkdf2Sync(content, salt, 100000, 512, 'sha512');
    return {
        password: hashContent.toString('hex'),
        salt: salt
    };
}

function genRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

export const cryptoUtils = {
    genRandomString: genRandomString,
    hashWithSalt: hashWithSalt
};
