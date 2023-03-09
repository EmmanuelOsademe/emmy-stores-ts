import {Request, Response, NextFunction} from 'express';
import { verifyAccessToken } from '@/utils/token';

export default async function deserialiseUser(req: Request, res: Response, next: NextFunction){
    
    const accessToken = (req.headers.authorization || "").replace(
        /^Bearer\s/, ""
    )

    if(!accessToken){
        return next();
    }

    const decoded = await verifyAccessToken(accessToken);

    if(decoded){
        res.locals.user = decoded;
    }

    return next();
}