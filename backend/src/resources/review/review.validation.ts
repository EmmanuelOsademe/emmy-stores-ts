import {object, string, number} from 'zod';

export const createReviewSchema = object({
    params: object({
        productId: string()
    }),
    body: object({
        rating: number({
            required_error: "Please provide rating"
        }).int().min(1, "Rating cannot be less than 1").max(5, "Rating cannot be more than 5"),
        comment: string().min(10, "Comment cannot be 10 characters").max(100, "Comment cannot be more than 100 characters")
    })
})

export const getSingleReviewSchema = object({
    params: object({
        reviewId: string()
    })
})

export const getProductReviewSchema = object({
    params: object({
        productId: string()
    })
})

export const deleteReviewSchema = object({
    params: object({
        reviewId: string()
    })
})