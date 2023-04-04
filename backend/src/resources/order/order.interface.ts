import { TypeOf } from "zod";
import {createOrderSchema, getSingleOrderSchema, getUserOrderSchema, updateOrderSchema} from '@/resources/order/order.validation';
import mongoose from "mongoose";

export type CreateOrderInterface = TypeOf<typeof createOrderSchema>['body'];
export type GetUserOrderInterface = TypeOf<typeof getUserOrderSchema>['params'];
export type GetSingleOrderInterface = TypeOf<typeof getSingleOrderSchema>['params'];
export type UpdateOrderInterface = TypeOf<typeof updateOrderSchema>;

export type singleOrderInterface = {
    quantity: number; 
    productName: string;
    price: number;
    image: string;
    product: mongoose.Types.ObjectId;
}