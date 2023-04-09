import "./adminProducts.css"
import React, {useContext, useState} from 'react';
import { AdminSidebar } from '../../components/adminSidebar/AdminSidebar';
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import { formHelper } from "../../utils/formHelper";

export const AdminProducts: React.FC = () => {
    const [productsFile, setProductsFile] = useState<File | null>(null);
    const [purchasesFile, setPurchasesFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const {baseUrl} = useContext(Context);
    const {alert, showAlert, hideAlert, loading, setLoading, success, setSuccess} = formHelper();

    const handleProductsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files !== null){
            setProductsFile(event.target.files[0]);
        }
    }

    const handlePurchasesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files !== null){
            setPurchasesFile(event.target.files[0]);
        }
    }
    console.log(purchasesFile);
    

    const handleProductsSubmit = async (event: React.SyntheticEvent) => {
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
                    navigate('/admin-products');
                    setProductsFile(null);
                }
            } catch (e: any) {
                console.log(e);
                setLoading(false);
                navigate('/admin-products');
            }
        }
    }

    const handlePurchasesSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        hideAlert();
        setLoading(true);
        console.log("Submitting request")
        
        const formData = new FormData();

        if(purchasesFile){
            formData.append('purchases', purchasesFile);

            try {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                    },
                    body: formData
                }

                const response = await fetch(`${baseUrl}/purchases/createPurchase`, requestOptions);
                console.log(response)
                if(!response.ok){
                    showAlert("An error occurred, try again", 'danger');
                    setLoading(false);
                    navigate('/admin-products');
                    hideAlert();
                    setProductsFile(null);
                }else{
                    const result = await response.json();
                    console.log(result);
                    setLoading(false);
                    navigate('/admin-products');
                    setPurchasesFile(null);
                }
            } catch (e: any) {
                console.log(e);
                setLoading(false);
                navigate('/admin-products');
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
                    <form onSubmit={handlePurchasesSubmit} className="createProduct-form">
                        <div className="createProduct-form_items">
                            <span>Upload Purchased Products: </span>
                            <input 
                                type="file"
                                accept=".csv"
                                onChange={handlePurchasesChange}
                                name={purchasesFile !== null ? purchasesFile?.name : "No file chosen"}
                            />
                        </div>
                        <button className="formBtn" disabled={!purchasesFile || purchasesFile === null}>{loading ? 'Loading' : 'Upload Purchases'}</button>
                    </form>
                    <form onSubmit={handleProductsSubmit} className="createProduct-form">
                        <div className="createProduct-form_items">
                            <span>Update Products Details: </span>
                            <input 
                                type="file"
                                accept=".csv"
                                onChange={handleProductsChange}
                            />
                        </div>
                        <button className="formBtn" disabled={!productsFile || productsFile === null}>{loading ? 'Loading' : 'Update Products'}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}