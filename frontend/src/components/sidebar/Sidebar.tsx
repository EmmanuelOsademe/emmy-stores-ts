import "./Sidebar.css";
import React, {} from 'react';
import { Rating } from '../rating/Rating';

export const Sidebar: React.FC = () => {
    return (
        <div className='sidebar'>
            <span className='sidebar-title'>Filter Products</span>
            <label className="sidebar-item">
                <input type="radio" name="radio" className="sidebar-item_icon"/>
                <span className="sidebar-item_label">Ascending</span>
            </label>
            <label className="sidebar-item">
                <input type="radio" name="radio" className="sidebar-item_icon"/>
                <span className="sidebar-item_label">Descending</span>
            </label>
            <div className="sidebar-item">
                <input type="checkbox" id='out-of-stock' className="sidebar-item_icon"/>
                <span className="sidebar-item_label">Include Out of Stock</span>
            </div>
            <div className="sidebar-item">
                <input type="checkbox" id='fast-delivery' className="sidebar-item_icon"/>
                <span className="sidebar-item_label">Free Shipping</span>
            </div>
            <Rating />
            <button className="sidebar-button">Clear All Filters</button>
        </div>
    )
}