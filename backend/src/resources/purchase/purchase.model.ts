import {prop, post, Ref, getModelForClass, ReturnModelType, modelOptions, index} from '@typegoose/typegoose';
import ProductModel, {Product} from '@/resources/product/product.model';
import log from '@/utils/logger';
import mongoose from 'mongoose';

export class singleProduct {
    @prop({required: true})
    productName: string

    @prop({required: true})
    unitCost: number

    @prop({required: true, default: 0})
    quantity: number
}

export class Purchase {
    _id: mongoose.Types.ObjectId

    @prop({type: singleProduct, required: true})
    products: Array<singleProduct>

    @prop({required: true})
    totalCost: number
}

const PurchaseModel = getModelForClass(Purchase, {
    schemaOptions: {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
});
export default PurchaseModel;


 /*public static async incrementStock(this: ReturnModelType<typeof Purchase>, productId: Ref<Product>, quantity: number){
        try {
            const product = await ProductModel.findById({_id: productId});
            if(!product){
                throw new Error("Product does not exist");
            }

            product.currentStock = product.currentStock + quantity;
            await product.save();
        } catch (e: any) {
            log.error(e.message);
        }
    }*/

    /*@post<Purchase>('save', async function(){
    try {
        await PurchaseModel.incrementStock(this.product, this.quantity);
        return;
    } catch (e: any) {
        console.log(e.message);
    }
})*/