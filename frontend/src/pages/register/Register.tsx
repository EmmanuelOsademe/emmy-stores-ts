import "./register.css";
import React, {useContext, useState} from 'react';
import { Context } from "../../context/Context";
import { UserInterface } from "../../interface/user";
import { Link, useNavigate } from "react-router-dom";
import { formHelper } from "../../utils/formHelper";

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const {baseUrl} = useContext(Context);
    const {alert, showAlert, hideAlert, loading, setLoading, success, setSuccess} = formHelper();

    const [regDetails, setRegDetails] = useState<UserInterface>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: {
            houseAddress: "",
            city: "",
            country: ""
        },
        password: "",
        passwordConfirmation: ""
    })

    const [backgroundColor, setBackgroundColor] = useState<string>("inherit");
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    

    const handlePasswordChange = () => {
        if(strongRegex.test(regDetails.password)){
            setBackgroundColor("#0F9D58")
        }else if(mediumRegex.test(regDetails.password)){
            setBackgroundColor("#F4B400")
        }else{
            setBackgroundColor("#DB4437")
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.currentTarget;
        
        setRegDetails(prevDetails => {
            if(['houseAddress', 'city', 'country'].indexOf(name) > -1){
                const newAddress = {...prevDetails.address, [name]: value};
                return {...prevDetails, address: newAddress}
            }else{
                return {...prevDetails, [name]: value}
            }

        })

        if(name === 'password'){
            handlePasswordChange();
        }
    }

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        hideAlert();
        setLoading(true);
        const {firstName, lastName, email, phone, address, password, passwordConfirmation} = regDetails;
        const userDetails = {firstName, lastName, phone, email, address, password, passwordConfirmation};

        if(password !== passwordConfirmation){
            showAlert("Passwords do not match", "danger")
        }

        try {
            const requestOptions = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userDetails)
            }

            const response = await fetch(`${baseUrl}/users/register`, requestOptions)
            console.log(response);


            if(response.status === 400){
                showAlert("Something went wrong", 'danger');
                setLoading(false);
                setSuccess(false);
                hideAlert();
                navigate('/register');
            }
            const {msg} = await response.json();

            setSuccess(true);
            setRegDetails({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: {
                    houseAddress: "",
                    city: "",
                    country: ""
                },
                password:"",
                passwordConfirmation: ""
            })
            showAlert(msg, 'success');
            
            if(response.ok){
                navigate('/login');
            }
        } catch (error: any) {
            showAlert("Something went wrong", 'danger');
            setLoading(false);
            navigate('/register');
            hideAlert();
        }
    }

    return (
        <div className="register">
            {
                alert.show && (
                    <div className={`alert alert-${alert.type}`}>
                        {alert.text}
                    </div>
                )
            }
            {
                !success && (
                    <>
                        <h1 className="regHeader">Please enter your details</h1>
                        <form onSubmit={handleSubmit} className="regForm">
                            <div className="formInputs">
                                <div className="newUserItem">
                                    <label>First Name: </label>
                                    <input type="text" placeholder="John" name="firstName" value={regDetails.firstName} onChange={handleChange} required/>
                                </div>
                                <div className="newUserItem">
                                    <label>Last Name: </label>
                                    <input type="text" placeholder="Doe" name="lastName" value={regDetails.lastName} onChange={handleChange} required/>
                                </div>
                                <div className="newUserItem">
                                    <label>Email: </label>
                                    <input type="email" placeholder="john.doe@domainName.com" name="email" value={regDetails.email} onChange={handleChange} required/>
                                </div>
                                <div className="newUserItem">
                                    <label>Phone: </label>
                                    <input type="tel" placeholder="0912-345-6789" name="phone" value={regDetails.phone} onChange={handleChange} pattern="[0-9]{4}[0-9]{3}[0-9]{4}" maxLength={11} minLength={11} required/>
                                </div>
                                <div className="newUserItem">
                                    <label>Address: </label>
                                    <input type="text" placeholder="3, Broadway Close" name="houseAddress" value={regDetails.address.houseAddress} onChange={handleChange} required/>
                                </div>
                                <div className="newUserItem">
                                    <label>City: </label>
                                    <input type="text" placeholder="Warri" name="city" value={regDetails.address.city} onChange={handleChange} required/>
                                </div>
                                <div className="newUserItem">
                                    <label>Country: </label>
                                    <input type="text" placeholder="Nigeria" name="country" value={regDetails.address.country} onChange={handleChange} required/>
                                </div>
                                
                                <div className="newUserItem">
                                    <label>Password: </label>
                                    <input type="password" name="password" value={regDetails.password} onChange={handleChange} style={{backgroundColor: `${backgroundColor}`}} required/>
                                </div>
                                
                                
                                <div className="newUserItem">
                                    <label>Confirm Password: </label>
                                    <input type="password" name="passwordConfirmation" value={regDetails.passwordConfirmation} onChange={handleChange} required/>
                                </div>
                            </div>
                        <button className="regBtn">{loading ? "Loading" : "Create Account"}</button>
                </form>
                <div className="loginRoute">
                    Already have an account?
                    <Link to="/login" className="loginLink"> Login here</Link>
                </div>
            </>
                )
            }
        </div>
    )
}