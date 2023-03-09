import  'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import UserController from '@/resources/user/user.controller';
import SessionController from '@/resources/session/session.controller';
import ProductController from '@/resources/product/product.controller';
import OrderController from '@/resources/order/order.controller';
import ReviewController from '@/resources/review/review.controller';
import PurchaseController from '@/resources/purchase/purchase.controller';

validateEnv();

const app = new App(
    [
        new UserController(), 
        new SessionController(), 
        new ProductController(), 
        new OrderController(), 
        new ReviewController(),
        new PurchaseController()
    ], 
    Number(process.env.PORT)
);

app.listen();