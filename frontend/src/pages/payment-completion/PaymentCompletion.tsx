import "./paymentCompletion.css";
import React, { useContext } from "react";
import { Context } from "../../context/Context";
import { Link } from "react-router-dom";

export const PaymentCompletion: React.FC = () => {
    const {user} = useContext(Context);
    return (
        <div className="payment-completion">
            <div className="payment-completion_text">
                <div>{`Hello ${user?.firstName}`}</div>
                <div>{`Your payment was successful`}</div>
                <div>{`Thank you for your patronage`}</div>
            </div>
            <div className="payment-completion_btns">
                <Link to="/">
                    <button className="payment-completion_btn">Back to Shopping</button>
                </Link>
            </div>
        </div>
    )
}