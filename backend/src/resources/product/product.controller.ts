import {Router, Request, Response, NextFunction} from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/httpException';
import validateResource from '@/middlewares/validation.middleware';
import isAdmin from '@/middlewares/isAdmin.middleware';
import {createProductSchema, deleteSingleProductSchema, getAllProductsSchema, getSingleProductSchema, updateProductSchema} from '@/resources/product/product.validation';
import {CreateProductInterface, DeleteSingleProductInterface, GetAllProductsInterface, GetSingleProductInterface, UpdateProductInterface} from '@/resources/product/product.interface';
import ProductService from '@/resources/product/product.service';
import log from '@/utils/logger';
import upload from '@/utils/imageUpload';

class ProductController implements Controller {
    public path = '/products';
    public router = Router();
    private ProductService = new ProductService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/createProduct`,
            [isAdmin, validateResource(createProductSchema)],
            this.createProduct
        )

        this.router.put(
            `${this.path}/updateProduct/:productId`,
            [isAdmin, validateResource(updateProductSchema)],
            this.updateProduct
        )

        this.router.get(
            `${this.path}/getSingleProduct/:productId`,
            [validateResource(getSingleProductSchema)],
            this.getSingleProduct
        )

        this.router.delete(
            `${this.path}/deleteSingleProduct/:productId`,
            [isAdmin, validateResource(deleteSingleProductSchema)],
            this.deleteSingleProduct
        );

        this.router.get(
            `${this.path}`,
            validateResource(getAllProductsSchema),
            this.getAllProducts
        );

        this.router.post(
            `${this.path}/uploadImage/:productId`,
            [isAdmin, upload.single('product')],
            this.uploadImage
        )
    }

    private createProduct = async (req: Request<{}, {}, CreateProductInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const productsInput = req.body;

        try {
            const dbProduct = await this.ProductService.createProduct(productsInput);
            res.status(StatusCodes.CREATED).json(dbProduct);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e));
        }
    }

    private updateProduct = async (req: Request<UpdateProductInterface['params'], {}, UpdateProductInterface['body']>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {productId} = req.params;
        const productUpdateInput = req.body;
        try {
            const product = await this.ProductService.updateProduct(productUpdateInput, productId);
            res.status(StatusCodes.OK).json(product);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getSingleProduct = async (req: Request<GetSingleProductInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {productId} = req.params;
        try {
            const product = await this.ProductService.getSingleProduct(productId);
            res.status(StatusCodes.OK).json(product);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private deleteSingleProduct = async (req: Request<DeleteSingleProductInterface>, res: Response, next: NextFunction): Promise<Response| void> =>{
        const {productId} = req.params;
        try {
            const message = await this.ProductService.deleteSingleProduct(productId);
            res.status(StatusCodes.OK).send(message)
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getAllProducts = async (req: Request<{}, {}, {}, GetAllProductsInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const searchInput = req.query;
        try {
            const result = await this.ProductService.getAllProducts(searchInput);
            res.status(StatusCodes.OK).json(result);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const {productId} = req.params;
        try {
            const product = await this.ProductService.uploadImage(productId, req);
            res.status(StatusCodes.OK).json(product);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message))
        }
    }
}

export default ProductController;