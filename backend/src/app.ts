import express, {Application} from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression'
import Controller from '@/utils/interfaces/controller.interface';
import rateLimiter from '@/utils/maximumRequest';
import errorMiddleware from '@/middlewares/error.middleware';
import deserialiseUser from '@/middlewares/deserialiseUser.middleware';
import AdminCronJobs from './utils/cronJobs/adminCronJobs';

class App {
    public express: Application;
    public port: number;
    private AdminCronJobs = new AdminCronJobs();

    constructor(controllers: Controller[], port: number){
        this.express = express();
        this.port = port;
        console.log(__dirname);

        this.initialiseDatabaseConnection();
        this.initialiseMiddlewares();
        this.initialiseControllers(controllers);
        this.initialiseCronJobs();
        this.initialiseErrorHandler();
    }

    private initialiseDatabaseConnection(): void {
        const  {MONGO_URI} = process.env;
        if(MONGO_URI){
            mongoose.set('strictQuery', false);
            mongoose.connect(MONGO_URI, {autoIndex: true})
        }
    }

    private initialiseMiddlewares(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));

        this.express.set('trust proxy', 1)
        this.express.use(rateLimiter);

        this.express.use(express.json());
        this.express.use(express.urlencoded({extended: false}));
        this.express.use(compression());
        this.express.use(deserialiseUser);
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) =>{
            this.express.use('/api/v1', controller.router)
        })
    }

    private initialiseCronJobs(): void{
        this.AdminCronJobs;
    }

    private initialiseErrorHandler(): void {
        this.express.use(errorMiddleware);
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App is listening on localhost:${this.port}`);
        })
    }
}


export default App;