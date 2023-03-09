import {ICart} from "../interface/cart";
import {Product} from "../../../backend/src/resources/product/product.model";
import {useState, useEffect} from 'react';

export interface IReducer {
    cart: ICart[];
}

type CartReducerActions = 
    {type: "ADD_TO_CART", payload: Product} |
    {type: "REMOVE_FROM_CART", payload: Product} |
    {type: "CHANGE_CART_QUANTITY", payload: ICart}

export const CartReducer = (state: IReducer, action: CartReducerActions): IReducer => {

    switch(action.type){
        case "ADD_TO_CART":
            state = {cart: [...state.cart, {id: action.payload._id as string, quantity: 1}]};
            updateCartInLocalStorage(state.cart);
            return state;
        case "REMOVE_FROM_CART":
            state = {cart: state.cart.filter((prod) => prod.id !== action.payload._id)}
            updateCartInLocalStorage(state.cart)
            return state;
        case "CHANGE_CART_QUANTITY":
            state = {cart: state.cart.filter((prod) => prod.id === action.payload.id ? (prod.quantity = action.payload.quantity): prod)}
            updateCartInLocalStorage(state.cart);
            return state;
        default:
            return state;
    }   
}

const updateCartInLocalStorage = (state: ICart[]): void => {
    localStorage.setItem("shopping-cart", JSON.stringify(state));
}

export const initialiseCart = (): IReducer => {
    const cartsInLocalStorage = localStorage.getItem('shopping-cart');
    return {cart: cartsInLocalStorage != null ? JSON.parse(cartsInLocalStorage) : []};
}
