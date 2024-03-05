import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptions/httpException';
import validateResource from '@/middlewares/validation.middleware';
import UserService from '@/resources/user/user.service';
import {
    createUserSchema,
    deleteUserSchema,
    forgotPasswordSchema,
    getSingleUserSchema,
    resetPasswordSchema,
    updateUserDetailsSchema,
    updateUserPasswordSchema,
    verifyUserSchema,
} from '@/resources/user/user.validation';
import {
    CreateUserInterface,
    DeleteUserInterface,
    ForgotPasswordInterface,
    GetSingleUserInterface,
    ResetPasswordInterface,
    UpdateUserDetailsInterface,
    UpdateUserPasswordInterface,
    VerifyUserInterface,
} from '@/resources/user/user.interface';
import log from '@/utils/logger';
import loggedIn from '@/middlewares/loggedIn.middleware';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validateResource(createUserSchema),
            this.register
        );

        this.router.get(
            `${this.path}/verify`,
            validateResource(verifyUserSchema),
            this.verify
        );

        this.router.post(
            `${this.path}/forgotPassword`,
            validateResource(forgotPasswordSchema),
            this.forgotPassword
        );

        this.router.post(
            `${this.path}/resetPassword`,
            validateResource(resetPasswordSchema),
            this.resetPassword
        );

        this.router.get(
            `${this.path}/currentUser`,
            loggedIn,
            this.getCurrentUser
        );

        this.router.get(`${this.path}`, loggedIn, this.getAllUser);

        this.router.get(
            `${this.path}/:userId`,
            [loggedIn, validateResource(getSingleUserSchema)],
            this.getSingleUser
        );

        this.router.put(
            `${this.path}/updateDetails`,
            [loggedIn, validateResource(updateUserDetailsSchema)],
            this.updateUserDetails
        );

        this.router.put(
            `${this.path}/updatePassword`,
            [loggedIn, validateResource(updateUserPasswordSchema)],
            this.updateUserPassword
        );

        this.router.delete(
            `${this.path}`,
            [loggedIn, validateResource(deleteUserSchema)],
            this.deleteUser
        );
    }

    private register = async (
        req: Request<{}, {}, CreateUserInterface>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const userInput = req.body;

        try {
            const message = await this.UserService.register(userInput);
            console.log(message);
            res.status(StatusCodes.CREATED).json({ msg: message });
        } catch (e: any) {
            console.log(e);
            log.error(e.message);
            if (e.code === 11000) {
                next(new HttpException(StatusCodes.CONFLICT, e.message));
            } else {
                next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
            }
        }
    };

    private verify = async (
        req: Request<{}, {}, {}, VerifyUserInterface>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const verificationInput = req.query;
        try {
            const message = await this.UserService.verify(verificationInput);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    };

    private forgotPassword = async (
        req: Request<{}, {}, ForgotPasswordInterface>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const forgotPasswordInput = req.body;

        try {
            const message = await this.UserService.forgotPassword(
                forgotPasswordInput
            );
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_GATEWAY, e.message));
        }
    };

    private resetPassword = async (
        req: Request<
            {},
            {},
            ResetPasswordInterface['body'],
            ResetPasswordInterface['query']
        >,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const resetPasswordQuery = req.query;
        const resetPasswordBody = req.body;

        try {
            const message = await this.UserService.resetPassword(
                resetPasswordQuery,
                resetPasswordBody
            );
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    };

    private getCurrentUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const user = res.locals.user;

        if (user) {
            res.status(StatusCodes.OK).json(user);
        } else {
            next(
                new HttpException(
                    StatusCodes.BAD_REQUEST,
                    'You are currently logged out'
                )
            );
        }
    };

    private getAllUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { role } = res.locals.user;
        try {
            const users = await this.UserService.getAllUsers(role);
            res.status(StatusCodes.OK).json(users);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.FORBIDDEN, e.message));
        }
    };

    private getSingleUser = async (
        req: Request<GetSingleUserInterface>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { role } = res.locals.user;
        const { userId } = req.params;

        try {
            const user = await this.UserService.getSingleUser(role, userId);
            res.status(StatusCodes.OK).json(user);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.UNAUTHORIZED, e.message));
        }
    };

    private updateUserDetails = async (
        req: Request<{}, {}, UpdateUserDetailsInterface>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { _id: userId } = res.locals.user;
        const updateData = req.body;

        try {
            const message = await this.UserService.updateUserDetails(
                updateData,
                userId
            );
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    };

    private updateUserPassword = async (
        req: Request<{}, {}, UpdateUserPasswordInterface>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const updatePasswordInput = req.body;
        const { _id: userId } = res.locals.user;
        try {
            const message = await this.UserService.updateUserPassword(
                updatePasswordInput,
                userId
            );
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    };

    private deleteUser = async (
        req: Request<{}, {}, DeleteUserInterface>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const deleteUserInput = req.body;
        const { _id: userId } = res.locals.user;
        try {
            const message = await this.UserService.deleteUser(
                deleteUserInput,
                userId
            );
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.FORBIDDEN, e.message));
        }
    };
}

export default UserController;
