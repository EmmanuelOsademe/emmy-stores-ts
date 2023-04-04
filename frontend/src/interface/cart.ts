import mongoose from "mongoose";

export interface ICart {
    productId: mongoose.Types.ObjectId;
    quantity: number;
}