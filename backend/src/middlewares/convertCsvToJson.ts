import { CreateProductInterface } from '@/resources/product/product.interface';
import log from '@/utils/logger';
import csv from 'csvtojson';
import {NextFunction, Request, Response} from 'express';

export default async function convertCsvToJson(req: Request, res: Response, next: NextFunction) {
    try {
        const products = await csv().fromFile(String(req.file?.path));
        const formattedProducts: CreateProductInterface[] = [];
        for(let product of products){
            formattedProducts.push({...product, 
                price: Number(product.price), 
                discountRate: Number(product.discountRate), 
                currentStock: Number(product.currentStock),
                triggerQuantity: Number(product.triggerQuantity),
                featured: product.featured.toLowerCase() === 'true' ? true : false,
                freeShipping: product.freeShipping.toLowerCase() === 'true' ? true : false,
                numOfReviews: Number(product.numOfReviews),
                averageRating: Number(product.averageRating)
            })
        }
        req.body.products = formattedProducts;
        return next();
    } catch (e:any) {
        console.log(e);
        log.error(e);
    }
}