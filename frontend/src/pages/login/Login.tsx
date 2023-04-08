import "./login.css";
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import { formHelper } from "../../utils/formHelper";

interface UserLogin {
    email: string;
    password: string;
}

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const {baseUrl, setUser, cartState: {cart}, setDeliveryAddress, user} = useContext(Context);
    const {alert, showAlert, hideAlert, loading, setLoading, success, setSuccess} = formHelper();

    const [loginDetails, setLoginDetails] = useState<UserLogin>({
        email: "",
        password: ""
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.currentTarget;

        setLoginDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }))
    }

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        hideAlert();
        setLoading(true);
        const {email, password} = loginDetails;
        const loginInfo = {email, password};
        
        try {
            const requestOptions = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginInfo)
            }

            const response = await fetch(`${baseUrl}/sessions/createSession`, requestOptions);
            
            if(!response.ok){
                showAlert("An error occurred. Try again!", 'danger');
                setLoading(false);
                navigate('/login');
                hideAlert();
            }
            const {accessToken, refreshToken, user} = await response.json();
            
            setLoginDetails({email: '', password: ''});
            setLoading(false);

            setUser(user);
            setDeliveryAddress(user.address)

            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('refreshToken', refreshToken);

            if(user){
                showAlert(`Welcome ${user.firstName}. You can now continue your operation`, 'success');
            }

            if(user && user.role === 'user' && cart.length > 0){
                navigate('/cart');
            }else if(user && user.role == 'admin'){
                navigate("/admin-home");
            }else{
                navigate('/')
            }
        } catch (error: any) {
            console.log(error);
            showAlert("Invalid Email or Password", 'danger');
            setLoading(false);
            navigate('/login');
        }
    }
    
    return (
        <div className="login">
            {alert.show && (
                <div className={`alert alert-${alert.type}`}>
                    {alert.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className='loginForm'>
                <div className="loginInputs">
                    <div className="loginItem">
                        <label>Email: </label>
                        <input type="email" placeholder="johndoe@domainName.com" name="email" onChange={handleChange} value={loginDetails.email} required />
                    </div>
                    <div className="loginItem">
                        <label>Password: </label>
                        <input type="password" placeholder="" name="password" onChange={handleChange} value={loginDetails.password} required />
                    </div>
                </div>
                <button className="loginBtn">{loading ? 'Loading...' : 'Login'}</button>
            </form>
            <div className="regRoute">
                Do not have an account? 
                <Link to="/register" className="regLink">
                    Create an account
                </Link>
            </div>
        </div>
    )
}