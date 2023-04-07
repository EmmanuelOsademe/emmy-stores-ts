import "./adminProducts.css"
import React, {useContext, useState} from 'react';
import { AdminSidebar } from '../../components/adminSidebar/AdminSidebar';
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import { formHelper } from "../../utils/formHelper";

export const AdminProducts: React.FC = () => {
    const [productsFile, setProductsFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const {baseUrl} = useContext(Context);
    const {alert, showAlert, hideAlert, loading, setLoading, success, setSuccess} = formHelper();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files !== null){
            setProductsFile(event.target.files[0]);
        }
    }
    console.log(loading);

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        hideAlert();
        setLoading(true);
        
        const formData = new FormData();

        if(productsFile){
            formData.append('products', productsFile);

            try {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                    },
                    body: formData
                }

                const response = await fetch(`${baseUrl}/products/createProduct`, requestOptions);
                if(!response.ok){
                    showAlert("An error occurred, try again", 'danger');
                    setLoading(false);
                    navigate('/admin-products');
                    hideAlert();
                    setProductsFile(null);
                }else{
                    const {dbProducts} = await response.json();
                    console.log(dbProducts);
                    navigate('/admin-home');
                    setProductsFile(null);
                }
            } catch (e: any) {
                console.log(e);
                setLoading(false);
                navigate('/admin-home');
            }
        }
    }
    return(
        <div className='adminProducts'>
            <div className='adminProducts-sidebar'>
                <AdminSidebar />
            </div>
            <div className='adminProducts-main'>
                <div className="product-forms">
                    <form onSubmit={handleSubmit} className="createProduct-form">
                        <div className="createProduct-form_items">
                            <span>Upload New Products: </span>
                            <input 
                                type="file"
                                accept=".csv"
                                onChange={handleChange}
                            />
                        </div>
                        <button className="formBtn" disabled={!productsFile || productsFile === null}>{loading ? 'Loading' : 'Upload Products'}</button>
                    </form>
                    <form onSubmit={handleSubmit} className="createProduct-form">
                        <div className="createProduct-form_items">
                            <span>Update Existing Products: </span>
                            <input 
                                type="file"
                                accept=".csv"
                                onChange={handleChange}
                            />
                        </div>
                        <button className="formBtn" disabled={!productsFile || productsFile === null}>{loading ? 'Loading' : 'Update Products'}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}