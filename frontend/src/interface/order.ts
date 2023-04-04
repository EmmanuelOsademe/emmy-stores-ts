import { ICart } from "./cart";
import { IAddress } from "./address";

export interface IOrder {
    cart: ICart[];
    total: number;
    subtotal: number;
    shippingFee: number;
    tax: number;
    deliveryOption: 'pickup' | 'home-delivery';
    deliveryAddress: IAddress
}