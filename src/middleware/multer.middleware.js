import multer from 'multer';
import __dirname from '../utils.js';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder;

        if (req.body.type === 'documents') {
            folder = 'documents';
        } else if (req.body.type === 'products') {
            folder = 'products';
        } else if (req.body.type === 'profiles') {
            folder = 'profiles';
        } else {
            throw new Error('Invalid type for storage: ' + req.body.type);
        }
        cb(null, path.join(__dirname, `./data/${folder}`));
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`);
    },
});

export const upload = multer({ storage });