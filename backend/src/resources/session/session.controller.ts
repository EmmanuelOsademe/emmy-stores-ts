import {Router, Request, Response, NextFunction} from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import validateResource from '@/middlewares/validation.middleware';
import HttpException from '@/utils/exceptions/httpException';
import { StatusCodes } from 'http-status-codes';
import log from '@/utils/logger';
import {get} from 'lodash';
import {createSessionSchema} from "@/resources/session/session.validation";
import {CreateSessionInterface} from "@/resources/session/session.interface";
import SessionService from '@/resources/session/session.service';
import loggedIn from '@/middlewares/loggedIn.middleware';

class SessionController implements Controller {
    public path = '/sessions';
    public router = Router();
    private SessionService = new SessionService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/createSession`,
            validateResource(createSessionSchema),
            this.createSession
        )

        this.router.get(
            `${this.path}/refreshSession`,
            this.refreshSession
        )

        this.router.delete(
            `${this.path}`,
            loggedIn,
            this.endSession
        )
    }

    private createSession = async (req: Request<{}, {}, CreateSessionInterface>, res: Response, next: NextFunction): Promise<Response | void> =>{
        const createSessionInput = req.body;

        try {
            const tokens = await this.SessionService.createSession(createSessionInput);
            res.status(StatusCodes.CREATED).json(tokens);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private refreshSession = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const refreshToken = get(req, "headers.x-refresh") as string;
        try {
            const token = await this.SessionService.refreshSession(refreshToken);
            res.status(StatusCodes.OK).json({accessToken: token});
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private endSession = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const {_id: userId} = res.locals.user;
        try {
            const message = await this.SessionService.endSession(userId);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }
}

export default SessionController;