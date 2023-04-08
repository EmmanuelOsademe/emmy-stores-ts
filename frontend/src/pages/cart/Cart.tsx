import "./Cart.css";
import React, {useContext, useEffect, Key} from "react";
import {useNavigate} from "react-router-dom";
import { Context } from "../../context/Context";
import { CartItem } from "../../components/cartItem/CartItem";
import { Product } from "../../../../backend/src/resources/product/product.model";
import { formatCurrency } from "../../utils/formatCurrency";


export const Cart: React.FC = () => {
    const navigate = useNavigate();

    const {cartState: {cart}, products, user, deliveryOption, setDeliveryOption, deliveryAddress,
    setDeliveryAddress, shippingFee, setShippingFee, tax, setTax, totalCost, setTotalCost, subTotal, setSubTotal} = useContext(Context);
    
    useEffect(() => {
        setSubTotal(cart.reduce((acc, curr) => acc + ((products.find(prod => prod._id === curr.productId) as Product)?.price * curr.quantity), 0))
    }, [cart])

    useEffect(() => {
        if(deliveryOption === "home-delivery"){
            const newShippingFee = 1000 + Math.floor(Math.random() * 1000)
            setShippingFee(newShippingFee);
        }else{
            const newShippingFee = Math.floor(Math.random() * 1000);
            setShippingFee(newShippingFee);
        }
    }, [deliveryOption])

    useEffect(() => {
        if(deliveryOption === "home-delivery"){
            setTotalCost(subTotal + shippingFee);
        }else{
            setTotalCost(subTotal + shippingFee)
        }
    }, [subTotal, shippingFee])

    
    const cartElements = cart.map(item => {
        return <CartItem key={item.productId as unknown as Key} cartItem={item} />
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.currentTarget;

        setDeliveryAddress(prevDetails => ({
            ...prevDetails,
            [name]: value
        }))
    }

    
    
    const isRadioSelected = (value: string): boolean => deliveryOption === value;

    const handleDeliverySelection = (e: React.ChangeEvent<HTMLInputElement>): void => setDeliveryOption(e.currentTarget.value as "pickup" | "home-delivery");

    return (
        <div className="cart">
            <div className="cartItems">{cartElements}</div>
            <div className="cart_summary">
                <div className="cart_summary-title">Cart Summary</div>
                <div className="cart_summary_details">
                    <div className="cart_summary_count">Cart items count: {cart.length}</div>
                    <div>Subtotal: {formatCurrency(subTotal/100)}</div>
                    <div>Shipping Fee: {formatCurrency(shippingFee / 100)}</div>
                    <div>Total Cost: {formatCurrency(totalCost/100)}</div>
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
                {deliveryOption === 'home-delivery' ? (
                    <>
                        <button className="deliveryBtn">Confirm your address</button>
                        <form>
                            <div className="newUserItem">
                                <label>Address: </label>
                                <input type="text" name="houseAddress" value={deliveryAddress.houseAddress} onChange={handleChange}/>
                            </div>
                            <div className="newUserItem">
                                <label>City: </label>
                                <input type="text" name="city" value={deliveryAddress.city} onChange={handleChange} required/>
                            </div>
                            <div className="newUserItem">
                                <label>Country: </label>
                                <input type="text" name="country" value={deliveryAddress.country} onChange={handleChange} required/>
                            </div>
                        </form>
                    </>
                ): (
                    <>
                        <button className="deliveryBtn">Confirm your city</button>
                        <form>
                            <div className="newUserItem">
                                <label>City: </label>
                                <input type="text" name="city" value={deliveryAddress.city} onChange={handleChange} required/>
                            </div>
                            <div className="newUserItem">
                                <label>Country: </label>
                                <input type="text" name="country" value={deliveryAddress.country} onChange={handleChange} required/>
                            </div>
                        </form>
                    </>
                    
                )}
            
                {!user ? (
                    <button className="checkoutBtn" onClick={() => navigate("/login")}>Login to Continue</button>
                ) : (
                    <button className="checkoutBtn" onClick={() => navigate("/payment")}>Proceed To Payment</button>
                )}
                
            </div>
        </div>
    )
}