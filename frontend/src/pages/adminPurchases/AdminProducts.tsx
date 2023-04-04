import "./adminProducts.css"
import React, {useState} from 'react';
import { AdminSidebar } from '../../components/adminSidebar/AdminSidebar';

export const AdminProducts: React.FC = () => {
    const [file, setFile] = useState<String>("");

    /*const handleChange = (event: React.) => {
        setFile(event.target.files[0]);
    }*/

    /*const handleChange = (selectorFiles: FileList) => {
        console.log(selectorFiles);
    }*/
    return(
        <div className='adminProducts'>
            <div className='adminProducts-sidebar'>
                <AdminSidebar />
            </div>
            <div className='adminProducts-main'>
                <form>
                    <span>Upload Products</span>
                    <input 
                        type="file"
                        name='file'
                        placeholder='uploadProducts'
                        
                        accept=".csv"
                    />
                </form>
            </div>
        </div>
    )
}