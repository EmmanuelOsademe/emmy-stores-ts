import {Request, Response, Router, NextFunction} from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/httpException';
import loggedIn from '@/middlewares/loggedIn.middleware';
import validateResource from '@/middlewares/validation.middleware';
import log from '@/utils/logger';
import {createReviewSchema, deleteReviewSchema, getProductReviewSchema, getSingleReviewSchema} from '@/resources/review/review.validation';
import {CreateReviewInterface, DeleteReviewInterface, GetProductReviewInterface, GetSingleReviewInterface} from '@/resources/review/review.interface';
import ReviewService from '@/resources/review/review.service';
import isAdmin from '@/middlewares/isAdmin.middleware';

class ReviewController implements Controller {
    public path = '/reviews';
    public router = Router();
    private ReviewService = new ReviewService;

    constructor(){
        this.initialiseRoutes()
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/:productId`,
            [loggedIn, validateResource(createReviewSchema)],
            this.createReview
        );

        this.router.get(
            `${this.path}`,
            isAdmin,
            this.getAllReviews
        )

        this.router.get(
            `${this.path}/:reviewId`,
            [loggedIn, validateResource(getSingleReviewSchema)],
            this.getSingleReview
        )

        this.router.get(
            `${this.path}/product/:productId`,
            [loggedIn, validateResource(getProductReviewSchema)],
            this.getProductReviews
        )

        this.router.delete(
            `${this.path}/:reviewId`,
            [loggedIn, validateResource(deleteReviewSchema)],
            this.deleteReview
        )
    }

    private createReview = async (req: Request<CreateReviewInterface['params'], {}, CreateReviewInterface['body']>, res: Response, next: NextFunction): Promise<Response | void> => {
        const reviewInput = req.body;
        const {productId} = req.params;
        const {_id: userId} = res.locals.user;

        try {
            const review = await this.ReviewService.createReview(reviewInput, productId, userId);
            res.status(StatusCodes.CREATED).json(review);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getAllReviews = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const reviews = await this.ReviewService.getAllReviews();
            res.status(StatusCodes.OK).json(reviews);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, e.message))
        }
    }

    private getSingleReview = async (req: Request<GetSingleReviewInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {_id: userId, role} = res.locals.user;
        const {reviewId} = req.params;
        try {
            const review = await this.ReviewService.getSingleReview(reviewId, userId, role);
            res.status(StatusCodes.OK).json(review);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getProductReviews = async (req: Request<GetProductReviewInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {productId} = req.params;
        try {
            const review = await this.ReviewService.getProductReviews(productId);
            res.status(StatusCodes.OK).json(review);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private deleteReview = async (req: Request<DeleteReviewInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {reviewId} = req.params;
        const {_id: userId, role} = res.locals.user;
        
        try {
            const message = await this.ReviewService.deleteReview(reviewId, userId, role);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message))
        }
    }
}

export default ReviewController;