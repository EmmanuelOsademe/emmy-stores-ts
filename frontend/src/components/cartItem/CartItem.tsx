import "./CartItem.css";
import React, {useContext, useState} from "react";
import { Context } from "../../context/Context";
import { ICart } from "../../interface/cart";
import { Product } from "../../../../backend/src/resources/product/product.model";
import {AddCircleOutline, DeleteOutline, RemoveCircleOutline} from '@mui/icons-material';
import { formatCurrency } from "../../utils/formatCurrency";
import mongoose from "mongoose";

interface Props {
    cartItem: ICart;
}

export const CartItem: React.FC<Props> = ({cartItem}) => {
    const {cartDispatch, products} = useContext(Context);
    const prod = products.find((prod) => prod._id === cartItem.productId);

    return (
        <div className="cartItem">
            <img src={prod?.image} alt={prod?.name} className="cartItem_img"/>
            <div className="cartItem_desc">
                <div className="cartItem_name">{prod?.name}</div>
                <div className="cartItem_qty">x {cartItem.quantity} {cartItem.quantity === 1 ? "quantity" : "quantities"}</div>
            </div>
            <div className="cartItem_icons">
                <AddCircleOutline 
                    className="cartItem_icon increment"
                    onClick={() => cartDispatch({type: "CHANGE_CART_QUANTITY", payload: {productId: prod?._id as mongoose.Types.ObjectId, quantity: cartItem.quantity < Number(prod?.currentStock) ? Number(cartItem.quantity + 1) : Number(prod?.currentStock)}})}
                />
                <RemoveCircleOutline 
                    className="cartItem_icon decrement"
                    onClick={() => cartDispatch({type: "CHANGE_CART_QUANTITY", payload: {productId: prod?._id as mongoose.Types.ObjectId, quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 1}})}
                />
                <DeleteOutline 
                    className="cartItem_icon remove"
                    onClick={() => cartDispatch({type: "REMOVE_FROM_CART", payload: prod as Product})}
                />
            </div>
            <div className="cartItem_price">{formatCurrency((Number(prod?.price))/100 * cartItem.quantity)}</div>
        </div>
    )
}