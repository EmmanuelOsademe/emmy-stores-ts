import multer, { diskStorage, Multer } from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
    destination: ((req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, ".././backend/src/data/uploads/products")
    }),
    filename: ((req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, file.originalname)
    })
})

export const uploadProducts = multer(
    {
        storage
    }
)

export const multerUpload = (filedir: string): Multer => {
    return multer({
        storage: diskStorage({
            destination: ((req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                cb(null, filedir)
            }),
            filename: ((req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
                cb(null, file.originalname)
            })
        })
    })
}