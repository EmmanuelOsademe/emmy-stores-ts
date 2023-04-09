import {Router, Request, Response, NextFunction} from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/httpException';
import validateResource from '@/middlewares/validation.middleware';
import isAdmin from '@/middlewares/isAdmin.middleware';
import log from '@/utils/logger';
import {createPurchaseSchema, getDailyPurchasesSchema, getSinglePurchaseSchema} from '@/resources/purchase/purchase.validation';
import {CreatePurchaseInterface, GetDailyPurchasesInterface, GetSinglePurchaseInterface} from '@/resources/purchase/purchase.interface';
import PurchaseService from '@/resources/purchase/purchase.service';
import { multerUpload } from '@/utils/imports/products-import';
import CsvToJsonConverter from '@/middlewares/convertCsvToJson';


class PurchaseController implements Controller {
    public path ='/purchases';
    public router = Router();
    private PurchaseService = new PurchaseService()
    private CsvToJsonConverter = new CsvToJsonConverter();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/createPurchase`,
            [isAdmin, 
                multerUpload(`../backend/src/data/uploads/purchases`).single('purchases'), 
                this.CsvToJsonConverter.purchasesUpload, 
                validateResource(createPurchaseSchema)
            ],
            this.createPurchase
        )

        this.router.get(
            `${this.path}`,
            [isAdmin, validateResource(getDailyPurchasesSchema)],
            this.getDailyPurchases
        )
        
        this.router.get(
            `${this.path}/:purchaseId`,
            [isAdmin, validateResource(getSinglePurchaseSchema)],
            this.getSinglePurchase
        )
    }

    private createPurchase = async (req: Request<{}, {}, CreatePurchaseInterface['body']>, res: Response, next: NextFunction): Promise<Response | void> => {
        const products = req.body.purchases;
        console.log(products)

        try {
            const purchase = await this.PurchaseService.createPurchase(products);
            res.status(StatusCodes.CREATED).json(purchase);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getDailyPurchases = async (req: Request<{}, {}, {}, GetDailyPurchasesInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const queryInput = req.query;
        try {
            const purchases = await this.PurchaseService.getDailyPurchases(queryInput);
            res.status(StatusCodes.OK).json(purchases);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, e.message))
        }
    }

    private getSinglePurchase = async (req: Request<GetSinglePurchaseInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {purchaseId} = req.params;
        try {
            const purchase = await this.PurchaseService.getSinglePurchase(purchaseId);
            res.status(StatusCodes.OK).json(purchase);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
        }
    }
}

export default PurchaseController;