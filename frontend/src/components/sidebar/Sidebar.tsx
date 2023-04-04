import "./Sidebar.css";
import React, { useContext } from 'react';
import { Rating } from '../rating/Rating';
import { Context } from "../../context/Context";

export const Sidebar: React.FC = () => {
    const {productFilterState: {byRating, byStock, sort, byShipping}, productFilterDispatch} = useContext(Context)
    return (
        <div className='sidebar'>
            <span className='sidebar-title'>Filter Products</span>
            <label className="sidebar-item">
                <input 
                    type="radio" 
                    name="radio" 
                    className="sidebar-item_icon"
                    onChange={() => productFilterDispatch({
                        type: "SORT_BY_PRICE",
                        payload: "Ascending"
                    })}
                    checked={sort === "Ascending" ? true: false}
                />
                <span className="sidebar-item_label">Ascending</span>
            </label>
            <label className="sidebar-item">
                <input 
                    type="radio" 
                    name="radio" 
                    className="sidebar-item_icon"
                    onChange={() => productFilterDispatch({
                        type: "SORT_BY_PRICE",
                        payload: "Descending"
                    })}
                    checked={sort === "Descending" ? true : false}
                />
                <span className="sidebar-item_label">Descending</span>
            </label>
            <div className="sidebar-item">
                <input 
                    type="checkbox" 
                    id='out-of-stock' 
                    className="sidebar-item_icon"
                    onChange={() => productFilterDispatch({
                        type: "FILTER_BY_STOCK"
                    })}
                    checked={byStock}
                />
                <span className="sidebar-item_label">Include Out of Stock</span>
            </div>
            <div className="sidebar-item">
                <input 
                    type="checkbox" 
                    id='free-shipping' 
                    className="sidebar-item_icon"
                    onChange={() => productFilterDispatch({
                        type: "FILTER_BY_SHIPPING"
                    })}
                    checked={byShipping}
                />
                <span className="sidebar-item_label">Free Shipping</span>
            </div>
            <Rating 
                rating={byRating}
                onClick={(index) => productFilterDispatch({
                    type: "FILTER_BY_RATING",
                    payload: index + 1
                })}
                style={{cursor: "pointer"}}
            />
            <button 
                className="sidebar-button"
                onClick={() => productFilterDispatch({
                    type: "CLEAR_ALL_FILTERS"
                })}
            >
                Clear All Filters
            </button>
        </div>
    )
}