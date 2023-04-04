import React, { useState } from "react";
import "./passwordContainer.css"

interface Prop {
    containerStyles: string;
    passwordLabel: string;
    passwordValue: string;
}


export const PasswordContainer: React.FC<Prop> = ({containerStyles, passwordLabel, passwordValue}) => {
    const [backgroundColor, setBackgroundColor] = useState<string>("#979696");
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    const handlePasswordChange = (): void => {
        if(strongRegex.test(passwordValue)){
            setBackgroundColor("#0F9D58")
        }else if(mediumRegex.test(passwordValue)){
            setBackgroundColor("#F4B400")
        }else{
            setBackgroundColor("#DB4437")
        }
    }
    return (
        <div>
            <div className={containerStyles} style={{backgroundColor:`${backgroundColor}`}}>
                <label>{passwordLabel}: </label>
                <input type="password" name="password" value={passwordValue} onChange={handlePasswordChange} required/>
            </div>
        </div>
    )
}