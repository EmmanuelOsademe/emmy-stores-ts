import {Router, Request, Response, NextFunction} from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/httpException';
import validateResource from '@/middlewares/validation.middleware';
import log from '@/utils/logger';
import isAdmin from '@/middlewares/isAdmin.middleware';
import AdminService from '@/resources/admin/admin.service';


class AdminController implements Controller {
    public path = '/admin';
    public router = Router();
    private AdminService = new AdminService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(
            `${this.path}/sales-purchases`,
            isAdmin,
            this.getSalesPurchases
        );

        this.router.get(
            `${this.path}/monthly-sales`,
            isAdmin,
            this.getMonthlySales
        );

        
    }

    private getSalesPurchases = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.AdminService.getSalesPurchases ();
            res.status(StatusCodes.OK).json(result);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getMonthlySales = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await this.AdminService.getMonthlySales();
            res.status(StatusCodes.OK).json(result);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message))
        }
    }
}

export default AdminController;