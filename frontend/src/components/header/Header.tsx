import React, {useState, useContext} from 'react';
import "./Header.css";
import {PermIdentity, ShoppingCartOutlined, HelpOutlineOutlined, SearchOutlined, Help} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import { Context } from '../../context/Context';


export const Header: React.FC = () => {
    const [showIconTitle, setShowIconTitle] = useState<Boolean>(false);
    const {cartState: {cart}, user, productFilterState: {searchQuery}, productFilterDispatch} = useContext(Context);

    const [query, setQuery] = useState<string>(searchQuery)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.currentTarget;
        setQuery(value);
        productFilterDispatch({
            type: "FILTER_BY_SEARCH",
            payload: value
        })
    }

    return (
        <div className='header'>
            <div className='header-container'>
                <div className='header-left'>
                    <Link to="/" className='link logo_icon'>
                        <span>Shop Inn|</span>
                        <img 
                            src='/shopinnfav.png'
                            alt='logo'
                            className='logo'
                        />
                    </Link>
                </div>
                <div className='header-middle'>
                    <input 
                        type="text" 
                        name="searchQuery"
                        className='header-middle_input' 
                        placeholder='Search for Products'
                        onChange={handleChange}
                        value={query}
                    />
                    <SearchOutlined 
                        className='header-icons' />
                    {showIconTitle && (
                        <span>Search</span>
                    )}
                </div>
                <div className='header-right'>
                    <Link to='/login' className='link header-right_container' >
                        <PermIdentity className='header-icons'/>
                        {user && <span className='user_greeting'>Hi {user.firstName}</span>}
                        <span className='header-icons_title'>Account</span>
                    </Link>
                    <Link to='/cart' className='link header-right_container'>
                        <ShoppingCartOutlined className='header-icons' />
                        {cart.length > 0 && <span className='cartItems_count'>{cart.length}</span>}
                        <span className='header-icons_title'>Cart</span>
                    </Link>
                    <Link to='/help' className='link header-right_container'>
                        <HelpOutlineOutlined className='header-icons'/>
                        <span className='header-icons_title'>Help</span>
                    </Link>
                </div>
            </div>
        </div>
    ) 
}