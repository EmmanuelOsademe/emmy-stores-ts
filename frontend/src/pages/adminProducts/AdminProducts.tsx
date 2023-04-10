import "./adminProducts.css"
import React, {useContext, useState} from 'react';
import { AdminSidebar } from '../../components/adminSidebar/AdminSidebar';
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import { formHelper } from "../../utils/formHelper";

export const AdminProducts: React.FC = () => {
    const [productsFile, setProductsFile] = useState<File | null>(null);
    const [purchasesFile, setPurchasesFile] = useState<File | null>(null);
    const [isProductUploaded, setIsProductUploaded] = useState<boolean>(false);
    const [isPurchaseUploaded, setIsPurchaseUploaded] = useState<boolean>(false);
    const [productUploadFailed, setProductUploadFailed] = useState<boolean>(false);
    const [purchaseUploadFailed, setPurchaseUploadFailed] = useState<boolean>(false);

    const productUploadSuccessTimeout = (): void => {
        setTimeout(() => {
            setIsPurchaseUploaded(false)
        }, 5000);
    }

    const purchaseUploadSuccessTimeout = (): void => {
        setTimeout(() => {
            setIsPurchaseUploaded(false)
        }, 5000);
    }

    const productUploadFailureTimeout = (): void => {
        setTimeout(() => {
            setProductUploadFailed(false)
        }, 5000);
    }

    const purchaseUploadFailureTimeout = (): void => {
        setTimeout(() => {
            setPurchaseUploadFailed(false)
        }, 5000);
    }

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
                    hideAlert();
                    setProductsFile(null);
                }else{
                    const {dbProducts} = await response.json();
                    console.log(dbProducts);
                    setIsProductUploaded(true);
                    setProductsFile(null);
                    productUploadSuccessTimeout();
                }
            } catch (e: any) {
                setLoading(false);
                productUploadFailureTimeout();
            }
        }
    }

    const handlePurchasesSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        hideAlert();
        setLoading(true);
        
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
                
                if(!response.ok){
                    showAlert("An error occurred, try again", 'danger');
                    setLoading(false);
                    hideAlert();
                    setProductsFile(null);
                }else{
                    const result = await response.json();
                    setLoading(false);
                    
                    setIsPurchaseUploaded(true);
                    setPurchasesFile(null);
                    
                    purchaseUploadSuccessTimeout();
                    
                }
            } catch (e: any) {
                console.log(e);
                setLoading(false);
                purchaseUploadFailureTimeout()
            }
        }
    }
    console.log(isPurchaseUploaded);


    return(
        <div className='adminProducts'>
            <div className='adminProducts-sidebar'>
                <AdminSidebar />
            </div>
            <div className='adminProducts-main'>
                <div className="product-forms">
                    <form onSubmit={handlePurchasesSubmit} className="createProduct-form">
                        <div className="createProduct-form_items">
                            <span>Select Purchases: </span>
                            <input 
                                type="file"
                                accept=".csv"
                                onChange={handlePurchasesChange}
                                name={purchasesFile !== null ? purchasesFile?.name : "No file chosen"}
                            />
                        </div>
                        <button className="formBtn" disabled={!purchasesFile || purchasesFile === null}>{loading ? 'Loading' : 'Upload Purchases'}</button>
                        {isPurchaseUploaded && <div className="createProduct-form_success-message">Purchased products successfully uploaded</div>}
                        {purchaseUploadFailed && <div className="createProduct-form_failure-message">Purchases uploaded unsuccessful. Try again</div>}
                    </form>
                    <form onSubmit={handleProductsSubmit} className="createProduct-form">
                        <div className="createProduct-form_items">
                            <span>Select Products: </span>
                            <input 
                                type="file"
                                accept=".csv"
                                onChange={handleProductsChange}
                            />
                        </div>
                        <button className="formBtn" disabled={!productsFile || productsFile === null}>{loading ? 'Loading' : 'Upload Products'}</button>
                        {isProductUploaded && <div className="createProduct-form_success-message">Products successfully uploaded</div>}
                        {productUploadFailed && <div className="createProduct-form_failure-message">Products uploaded unsuccessful. Try again</div>}
                    </form>
                </div>
            </div>
        </div>
    )
}