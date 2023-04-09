import PurchaseModel, { singleProduct } from '@/resources/purchase/purchase.model';
import {CreatePurchaseInterface, GetDailyPurchasesInterface} from '@/resources/purchase/purchase.interface';
import {Ref} from '@typegoose/typegoose';
import Product from '@/resources/product/product.model';
import mongoose from 'mongoose';

class PurchaseService {
    private purchase = PurchaseModel;

    public async createPurchase(products: singleProduct[]): Promise<object | Error>{
        
        try {
            let totalCost = 0;
            for(let product of products){
                totalCost += (product.unitCost * product.quantity)
            }
            
            const purchase = await this.purchase.create({products, totalCost});
            return purchase;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getDailyPurchases(queryInput: GetDailyPurchasesInterface): Promise<object | Error>{
        const {productId} = queryInput;
        let filterOption: any;
        if(productId){
            filterOption = {product:  new mongoose.Types.ObjectId(productId)}
        }else{
            filterOption = {}
        }
        try {
            const purchases = await this.purchase.aggregate(
                [
                    {
                        $match: filterOption
                    },
                    {
                        $group: {
                            _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                            total: {$sum: "$totalCost"}
                        }
                    }
                ]
            );

            return purchases;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getSinglePurchase(purchaseId: string): Promise<object | Error>{
        try {
            const purchase = await this.purchase.findOne({_id: purchaseId});
            if(!purchase){
                throw new Error('Purchase not found');
            }
            return purchase;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
};

export default PurchaseService;