import PurchaseModel from '@/resources/purchase/purchase.model';
import {CreatePurchaseInterface, GetDailyPurchasesInterface} from '@/resources/purchase/purchase.interface';
import {Ref} from '@typegoose/typegoose';
import Product from '@/resources/product/product.model';
import mongoose from 'mongoose';

class PurchaseService {
    private purchase = PurchaseModel;

    public async createPurchase(purchaseBody: CreatePurchaseInterface['body']): Promise<object | Error>{
        const {quantity, unitCost, productId} = purchaseBody;
        try {
            const totalCost = quantity * unitCost;
            const purchase = await this.purchase.create({quantity, unitCost, product: productId, totalCost});
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