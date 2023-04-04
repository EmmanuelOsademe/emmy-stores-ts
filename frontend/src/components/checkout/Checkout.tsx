import "./checkout.css";
import React, { useState, useContext } from "react";
import {useStripe, useElements, PaymentElement} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";

export const Checkout: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const {cartDispatch} = useContext(Context);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        if(!stripe || !elements){
            return;
        }

        setIsProcessing(true);

        const {error, paymentIntent} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/completion`
            },
            redirect: "if_required"
        })

        if(error){
            setMessage(error.message as string);
        }else if(paymentIntent && paymentIntent.status === "succeeded"){
            setMessage(`Payment status: ${paymentIntent.status}!`);
            cartDispatch({type: "EMPTY_CART"});
            navigate("/payment-completion");
        }else{
            setMessage("Unexpected state");
        }

        setIsProcessing(false);

    }
    return(
        <form id="payment-form" className="checkout-form" onSubmit={handleSubmit}>
            <PaymentElement />
            <button disabled={isProcessing} id="submit" className="payBtn">
                <span id="button-text">
                    {isProcessing ? "Processing..." : "Pay now"}
                </span>
            </button>
        </form>
    )
}