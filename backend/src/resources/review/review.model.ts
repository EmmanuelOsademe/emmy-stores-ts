import {getModelForClass, index, modelOptions, post, prop, Ref, ReturnModelType} from '@typegoose/typegoose';
import {User} from '@/resources/user/user.model';
import ProductModel, {Product} from '@/resources/product/product.model';
import log from '@/utils/logger';


modelOptions({
    schemaOptions: {
        timestamps: true
    }
})

@index({
    product: 1,
    user: 1
})

@post<Review>('save', async function (){
    try {
        await ReviewModel.calculateAverateRating(this.product);
        return
    } catch (error) {
        console.log(error)
    }
})

@post<Review>('remove', async function (){
    try {
        await ReviewModel.calculateAverateRating((await this).product)
        return
    } catch (error) {
        console.log(error);
    }
})

export class Review {
    @prop({required: true, min: [1, "Minimum allowable rating is 1"], max: [5, "Maximum allowable rating is 5"]})
    rating: number

    @prop({required: true, maxlength: [100, "Comments cannot exceed 100 characters"]})
    comment: string

    @prop({ref: () => User})
    user: Ref<User>

    
    @prop({ref: () => "Product"})
    product: Ref<Product>

    public static async calculateAverateRating(this: ReturnModelType<typeof Review>, productId: Ref<Product>){
        const result = await this.aggregate(
            [
                {$match: {product: productId}},
                {
                    $group: {
                        _id: null,
                        averageRating: {$avg: "$rating"},
                        numOfReviews: {$sum: 1}
                    }
                }
            ]
        );
        
        try {
            log.info(result);
            await ProductModel.findOneAndUpdate(
                {_id: productId},
                {
                    averageRating: Math.ceil(result[0]?.averageRating || 0),
                    numOfReviews: result[0]?.numOfReviews || 0
                }
            )
        } catch (e: any) {
            log.error(e.message);
        }
    }
}

const ReviewModel = getModelForClass(Review);
export default ReviewModel;