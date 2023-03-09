import ReviewModel from '@/resources/review/review.model';
import {CreateReviewInterface} from '@/resources/review/review.interface';
import OrderModel from '@/resources/order/order.model';

class ReviewService {
    private review = ReviewModel;
    private OrderModel = OrderModel;

    public async createReview(reviewInput: CreateReviewInterface['body'], productId: string, userId: string): Promise<object | Error>{
        const {rating, comment} = reviewInput;
        try {
            const userOrders = await this.OrderModel.find({user: userId});
            if(userOrders.length === 0){
                throw new Error('User has not made any order');
            }

            let hasProduct: boolean = false;

            // Consider optimising
            for(let order of userOrders){
                const orderedItems = order.orderItems;
                for(let item of orderedItems){
                    if(String(item.product) === productId){
                        hasProduct = true;
                        break;
                    }
                }
            }

            if(hasProduct){
                const oldReview = await this.review.findOne({product: productId, user: userId});
                await oldReview?.remove();
                const review = this.review.create({rating, comment, user: userId, product: productId});
                return review;
            }else{
                throw new Error('You can only review products that you have ordered');
            }
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getAllReviews(): Promise<object | Error> {
        try {
            const reviews = await this.review.find({});
            return {reviews, count: reviews.length};
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getSingleReview(reviewId: string, userId: string, role: string): Promise<object | Error> {
        try {
            const review = await this.review.findById({_id: reviewId});
            if(!review){
                throw new Error('Review not found');
            }

            if(!(role === 'admin') && !(String(review.user) === userId)){
                throw new Error('Unauthorised to access this review');
            }

            return review;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getProductReviews(productId: string): Promise<Object | Error> {
        try {
            const review = await this.review.findOne({product: productId});
            if(!review){
                throw new Error('No review for this product');
            }
            return review;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async deleteReview(reviewId: string, userId: string, role: string): Promise<string | Error>{
        try {
            const review = await this.review.findById({_id: reviewId});
            if(!review){
                throw new Error("Review not found");
            }

            if(!(role === "admin") && !(String(review.user) === userId)){
                throw new Error("You are not authorised to carry out this operation")
            }

            await review.remove();
            return "Review successfully removed";
        } catch (e:any) {
            throw new Error(e.message);
        }
    }
}

export default ReviewService;