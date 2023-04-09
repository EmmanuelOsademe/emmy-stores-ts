import {Request, Response, NextFunction} from 'express';
import HttpException from '@/utils/exceptions/httpException';

export default function errorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    //console.log(req);
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    console.log(error);
    

    res.status(status).json({status, message})
}