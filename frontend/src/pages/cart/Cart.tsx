import "./Cart.css";
import React, {useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { Context } from "../../context/Context";
import { CartItem } from "../../components/cartItem/CartItem";
import { Product } from "../../../../backend/src/resources/product/product.model";
import { formatCurrency } from "../../utils/formatCurrency";

export const Cart: React.FC = () => {
    const {cartState: {cart}, products} = useContext(Context);
    const [total, setTotal] = useState<number>(0);
    const [deliveryOption, setDeliveryOption] = useState<string>('home-delivery');
    console.log(deliveryOption);
    const navigate = useNavigate();

    useEffect(() => {
        setTotal(cart.reduce((acc, curr) => acc + ((products.find(prod => prod._id === curr.id) as Product)?.price * curr.quantity), 0))
    }, [cart])
    
    const cartElements = cart.map(item => {
        return <CartItem key={item.id} cartItem={item} />
    })
    
    const isRadioSelected = (value: string): boolean => deliveryOption === value;

    const handleDeliverySelection = (e: React.ChangeEvent<HTMLInputElement>): void => setDeliveryOption(e.currentTarget.value);
    return (
        <div className="cart">
            <div className="cartItems">{cartElements}</div>
            <div className="cart_summary">
                <div className="cart_summary-title">Cart Summary</div>
                <div className="cart_summary_details">
                    <div className="cart_summary_count">Cart items count: {cart.length}</div>
                    <div>Subtotal: {formatCurrency(total/100)}</div>
                </div>
                <div className="delivery">
                    <div className="delivery-option">
                        <input 
                            type="radio" 
                            name="delivery_method"
                            value="home-delivery"
                            checked={isRadioSelected('home-delivery')}
                            onChange={handleDeliverySelection}
                        />
                        <label>Home Delivery</label>
                    </div>
                    <div className="delivery-option">
                        <input 
                            type="radio" 
                            name="delivery_method"
                            value="pickup"
                            checked={isRadioSelected('pickup')}
                            onChange={handleDeliverySelection}
                        />
                        <label>Pickup from Store</label>
                    </div>
                </div>
                {deliveryOption === 'pickup' ? (
                    <button className="deliveryBtn">Select pickup options</button>
                ): (
                    <button className="deliveryBtn">Enter your address</button>
                )}
                <button className="checkoutBtn" onClick={() => navigate("/order")}>Proceed to Checkout</button>
            </div>
        </div>
    )
}