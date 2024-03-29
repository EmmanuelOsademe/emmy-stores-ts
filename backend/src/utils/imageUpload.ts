import multer from 'multer';
import path from 'path';
import {Request} from 'express';

const upload = multer(
    {
        storage: multer.diskStorage({}),
        fileFilter: (req: Request, file, cb) => {
            let ext = path.extname(file.originalname);
            if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
                cb(new Error('File type not supported'))
                return
            }

            req.body.image = file.originalname;
            cb(null, true)
        }
    }
)

export default upload;