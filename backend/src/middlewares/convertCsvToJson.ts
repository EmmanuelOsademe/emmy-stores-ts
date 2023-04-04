import csv from 'csvtojson';
import {NextFunction, Request, Response} from 'express';

export default async function convertCsvToJson(req: Request, res: Response, next: NextFunction) {
    const jsonArray = await csv().fromFile(String(req.file?.path));
    console.log(jsonArray);
    req.body = jsonArray;
    return next();
}