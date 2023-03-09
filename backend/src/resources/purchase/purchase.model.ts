import {prop, post, Ref, getModelForClass, ReturnModelType, modelOptions, index} from '@typegoose/typegoose';
import ProductModel, {Product} from '@/resources/product/product.model';
import log from '@/utils/logger';

@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
})

@index({
    product: 1
})

@post<Purchase>('save', async function(){
    try {
        await PurchaseModel.incrementStock(this.product, this.quantity);
        return;
    } catch (e: any) {
        console.log(e.message);
    }
})

export class Purchase {
    @prop({ref: () => Product})
    product: Ref<Product>

    @prop({required: true})
    quantity: number

    @prop({required: true})
    unitCost: number

    @prop({required: true})
    totalCost: number

    public static async incrementStock(this: ReturnModelType<typeof Purchase>, productId: Ref<Product>, quantity: number){
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
    }
}

const PurchaseModel = getModelForClass(Purchase);
export default PurchaseModel;