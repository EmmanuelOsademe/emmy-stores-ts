import React, { useContext } from 'react';
import "./SingleProduct.css";
import { Context } from '../../context/Context';
import {StarOutline, Star} from '@mui/icons-material';

interface Props {
    prod: any;
}

export const SingleProduct: React.FC<Props> = ({prod}) => {
    const {cartState: {cart}, cartDispatch, productFilterState: {byRating}} = useContext(Context);
    
    return (
        <div className='product'>
            <img src={prod.image} alt={prod.name} className="product_img"/>
            <div className='product_details_top'>
                <div className='product_name'>{prod.name}</div>
                <div className='product_price'>${prod.price/100}</div>
            </div>
            <div className='product_details_bottom'>
                <div className="rating-icons-container">
                {
                    [...Array(5)].map((_, index) => {
                        return (
                            <span key={index}>
                                {prod.averageRating > index ? <Star className="rating-icons" /> : <StarOutline className="rating-icons" />}
                            </span>
                        )
                    })
                }
            </div>
                {prod.freeShipping && <div className='product_freeShipping'>Shipping is free</div>}
            </div>
            {
                cart.some(cartProd => cartProd.productId === prod._id) ? 
                    (
                        <button 
                            className='removeFromCartBtn' 
                            onClick={() => cartDispatch({type: "REMOVE_FROM_CART", payload: prod})}
                        >
                            Remove from Cart
                        </button>
                    ) : 
                    (
                        <button 
                            className='addToCartBtn'
                            onClick={() => cartDispatch({type: "ADD_TO_CART", payload: prod})}
                            disabled={prod.currentStock === 0}
                        >
                            {prod.currentStock === 0 ? "Out of Stock": "Add to Cart"}
                        </button>
                    )
            }
        </div>
    )
}