import { CreateProductInterface } from '@/resources/product/product.interface';
import log from '@/utils/logger';
import csv from 'csvtojson';
import {NextFunction, Request, Response} from 'express';
import HttpException from '@/utils/exceptions/httpException';
import { StatusCodes } from 'http-status-codes';
import { CreatePurchaseInterface } from '@/resources/purchase/purchase.interface';

/*export default async function convertCsvToJson(req: Request, res: Response, next: NextFunction) {
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
}*/

export default class CsvToJsonConverter {

    public productsUpload = async (req: Request, res: Response, next: NextFunction): Promise<void | Error> => {
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
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    public purchasesUpload = async (req: Request, res: Response, next: NextFunction): Promise<void | Error> => {
        try {
            const purchases = await csv().fromFile(String(req.file?.path));
            const formattedPurchases: CreatePurchaseInterface[] = [];
            for(let purchase of purchases){
                formattedPurchases.push({
                    ...purchase,
                    quantity: Number(purchase.quantity),
                    unitCost: Number(purchase.unitCost)
                })
            }

            req.body.purchases = formattedPurchases;
            return next();
        } catch (e: any) {
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message))
        }
    }
}