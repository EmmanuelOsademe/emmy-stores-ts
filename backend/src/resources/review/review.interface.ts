import { TypeOf } from "zod";
import { createReviewSchema, getSingleReviewSchema, getProductReviewSchema, deleteReviewSchema } from "@/resources/review/review.validation";

export type CreateReviewInterface = TypeOf<typeof createReviewSchema>
export type GetSingleReviewInterface = TypeOf<typeof getSingleReviewSchema>['params'];
export type GetProductReviewInterface = TypeOf<typeof getProductReviewSchema>['params'];
export type DeleteReviewInterface = TypeOf<typeof deleteReviewSchema>['params']