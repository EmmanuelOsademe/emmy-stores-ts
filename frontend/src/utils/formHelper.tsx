import { useState } from "react";

interface Alert {
    show: boolean;
    text: string;
    type: "danger" | "success"
}

export const formHelper = () => {
    const [alert, setAlert] = useState<Alert>({
        show: false,
        text: "",
        type: "danger"
    })

    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const showAlert = (text: string, type: 'danger' | 'success') => {
        setAlert({show: true, text, type});
    }

    const hideAlert = () => {
        setAlert({show: false, text: '', type: 'danger'});
    }

    return {
        alert,
        showAlert,
        hideAlert,
        loading,
        setLoading,
        success,
        setSuccess
    }
}