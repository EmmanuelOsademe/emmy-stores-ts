import { TypeOf } from 'zod';
import {createPurchaseSchema, getDailyPurchasesSchema, getSinglePurchaseSchema} from '@/resources/purchase/purchase.validation';

export type CreatePurchaseInterface = TypeOf<typeof createPurchaseSchema>;
export type GetDailyPurchasesInterface = TypeOf<typeof getDailyPurchasesSchema>['query'];
export type  GetSinglePurchaseInterface = TypeOf<typeof getSinglePurchaseSchema>['params'];