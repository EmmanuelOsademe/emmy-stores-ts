import {Router, Request, Response, NextFunction} from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/httpException';
import validateResource from '@/middlewares/validation.middleware';
import loggedIn from '@/middlewares/loggedIn.middleware';
import {createOrderSchema, getSingleOrderSchema, getUserOrderSchema, updateOrderSchema} from '@/resources/order/order.validation';
import {CreateOrderInterface, GetSingleOrderInterface, GetUserOrderInterface, UpdateOrderInterface} from '@/resources/order/order.interface';
import log from '@/utils/logger';
import OrderService from '@/resources/order/order.service';
import isAdmin from '@/middlewares/isAdmin.middleware';


class OrderController implements Controller {
    public path ='/orders';
    public router = Router();
    private OrderService = new OrderService();
    
    constructor(){
        this.initialiseRoutes()
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/createOrder`,
            [loggedIn, validateResource(createOrderSchema)],
            this.createOrder
        )

        this.router.get(
            `${this.path}/stripe/stripe-config`,
            loggedIn,
            this.getStripeKey
        )

        this.router.get(
            `${this.path}/user/order/:userId`,
            [loggedIn, validateResource(getUserOrderSchema)],
            this.getUserOrders
        )

        this.router.get(
            `${this.path}`,
            isAdmin,
            this.getAllOrders
        )

        this.router.get(
            `${this.path}/:orderId`,
            [loggedIn, validateResource(getSingleOrderSchema)],
            this.getSingleOrder
        )

        this.router.put(
            `${this.path}/:orderId`,
            [loggedIn, validateResource(updateOrderSchema)],
            this.updateOrder
        )

        this.router.get(
            `${this.path}/order/income`,
            isAdmin,
            this.getMonthlyIncome
        )
    }

    private createOrder = async (req: Request<{}, {}, CreateOrderInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const orderInput = req.body;
        const {_id: userId} = res.locals.user;

        try {
            const order = await this.OrderService.createOrder(orderInput, userId);
            res.status(StatusCodes.CREATED).json(order);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getStripeKey = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>{
        res.status(StatusCodes.OK).send(process.env.STRIPE_PUBLIC_KEY);
    }

    private getUserOrders = async (req: Request<GetUserOrderInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {userId} = req.params;
        try {
            const orders = await this.OrderService.getUserOrders(userId);
            res.status(StatusCodes.OK).json(orders);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.FORBIDDEN, e.message));
        }
    }

    private getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const orders = await this.OrderService.getAllOrders();
            res.status(StatusCodes.OK).json(orders);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
        }
    }

    private getSingleOrder = async (req: Request<GetSingleOrderInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {orderId} = req.params;
        const {_id: userId} = res.locals.user

        try {
            const order = await this.OrderService.getSingleOrder(orderId, userId);
            res.status(StatusCodes.OK).json(order);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private updateOrder = async (req: Request<UpdateOrderInterface['params'], {}, UpdateOrderInterface['body']>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {orderId} = req.params;
        const {status} = req.body;
        const {_id: userId} = res.locals.user
        try {
            const message = await this.OrderService.updateOrder(orderId, status, userId);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message))
        }
    }

    private getMonthlyIncome = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const income = await this.OrderService.getMonthlyIncome();
            res.status(StatusCodes.OK).json(income);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
        }
    }
}

export default OrderController;