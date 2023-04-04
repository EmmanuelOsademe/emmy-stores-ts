import {ICart} from "../interface/cart";
import {Product} from "../../../backend/src/resources/product/product.model";

export interface IReducer {
    cart: ICart[];
}


type CartReducerActions = 
    {type: "ADD_TO_CART", payload: Product} |
    {type: "REMOVE_FROM_CART", payload: Product} |
    {type: "CHANGE_CART_QUANTITY", payload: ICart} |
    {type: "EMPTY_CART"}
    

export const CartReducer = (state: IReducer, action: CartReducerActions): IReducer => {

    switch(action.type){
        case "ADD_TO_CART":
            state = {cart: [...state.cart, {productId: action.payload._id, quantity: 1}]};
            updateCartInLocalStorage(state.cart);
            return state;
        case "REMOVE_FROM_CART":
            state = {cart: state.cart.filter((prod) => prod.productId !== action.payload._id)}
            updateCartInLocalStorage(state.cart)
            return state;
        case "CHANGE_CART_QUANTITY":
            state = {cart: state.cart.filter((prod) => prod.productId === action.payload.productId ? (prod.quantity = action.payload.quantity): prod)}
            updateCartInLocalStorage(state.cart);
            return state;
        case "EMPTY_CART":
            state = {cart: []}
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
