import "./payment.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {Elements} from "@stripe/react-stripe-js";
import { Checkout } from "../../components/checkout/Checkout";
import {Order} from "../../../../backend/src/resources/order/order.model";

export const Payment: React.FC = () => {
    const navigate = useNavigate();
    const {baseUrl, user, cartState: {cart}, subTotal, totalCost, tax, shippingFee, deliveryOption, deliveryAddress} = useContext(Context);

    const apiCall = async (): Promise<Stripe | null> => {
        try {
            const response = await fetch(`${baseUrl}/orders/stripe/stripe-config`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                }
            });
    
            if(response.ok){
                const {publicKey} = await response.json();
                if(typeof publicKey === 'string'){
                    return loadStripe(publicKey) as Promise<Stripe>;
                }else{
                    return null;
                }
            }else{
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(() => apiCall());

    
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({cart, subTotal, shippingFee, tax, totalCost, deliveryOption, deliveryAddress})
        }
       

        const api = async () => {
            try {
                const response = await fetch(`${baseUrl}/orders/createOrder`, requestOptions);
                console.log(response);
                const order = await response.json();

                if(response.ok){
                    const {clientSecret: receivedSecret} = order;
                    setClientSecret(receivedSecret);
                }
            } catch (error) {
                console.log(error);
                navigate('/login');
            }
        }
        api();
    }, [])

    if(!user || user.role !== 'user'){
        navigate('/login');
    }

    return (
        <div className="payment">
            <div className="payment-items">
                <div className="payment-header">{`Hello ${user?.firstName}`}</div>
                <div className="payment-header">Please enter your card details</div>
                {
                    stripePromise && clientSecret && (
                        <Elements stripe={stripePromise} options={{clientSecret}} >
                            <Checkout />
                        </Elements>
                    )
                }
            </div>
        </div>
    )
}