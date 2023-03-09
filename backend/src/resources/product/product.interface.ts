import { TypeOf } from "zod";
import {
        createProductSchema, 
        deleteSingleProductSchema, 
        getAllProductsSchema, 
        getSingleProductSchema, 
        updateProductSchema,
        singleProductSchema
} from '@/resources/product/product.validation';

export type CreateProductInterface = TypeOf<typeof createProductSchema>['body'];
export type UpdateProductInterface = TypeOf<typeof updateProductSchema>
export type GetSingleProductInterface = TypeOf<typeof getSingleProductSchema>['params'];
export type DeleteSingleProductInterface = TypeOf<typeof deleteSingleProductSchema>['params'];
export type GetAllProductsInterface = TypeOf<typeof getAllProductsSchema>['query'];
export type singleProductInterface = TypeOf<typeof singleProductSchema>
