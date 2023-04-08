import "./adminHome.css";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context/Context";
import { Order, singleOrder } from "../../../../backend/src/resources/order/order.model";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { AdminSidebar } from "../../components/adminSidebar/AdminSidebar";
import {Box} from "@mui/material";
import { LineChartTemplate } from "../../components/lineChart/LineChart.Template";
import {SalesPurchasesI} from "../../../../backend/src/resources/admin/admin.interface";
import { FeaturedItem } from "../../components/featuredItem/FeaturedItem";
import { useEffectOnce } from "../../hooks/useEffectOnce";


export const AdminHome: React.FC = () => {
    const {baseUrl} = useContext(Context);

    const [sales, setSales] = useState<Order[]>([]);
    const [salesPurchases, setSalesPurchases] = useState<SalesPurchasesI[]>([]);

    useEffectOnce(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        }

        fetch(`${baseUrl}/orders`, requestOptions)
            .then(res => res.json())
            .then(data => setSales(data))
    })

    useEffectOnce(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        }

        fetch(`${baseUrl}/admin/sales-purchases`, requestOptions)
            .then(res => res.json())
            .then(data => setSalesPurchases(data))
    })

    /*useEffect(() => {
        
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        }

        fetch(`${baseUrl}/orders`, requestOptions)
            .then(res => res.json())
            .then(data => setSales(data))
    }, []);

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        }

        fetch(`${baseUrl}/admin/sales-purchases`, requestOptions)
            .then(res => res.json())
            .then(data => setSalesPurchases(data))
    }, [])*/
    
    

    const columns: GridColDef[] = [
        {
            field: "createdAt", 
            headerName: "Date", 
            width: 120, 
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: "orderItems",
            headerName: "Products",
            width: 250,
            type: "string",
            headerAlign: 'center',
            align: 'center',
            valueGetter(params: GridValueGetterParams): String {
                return params.row.orderItems.reduce((initialString: String, currProd: singleOrder) => {
                    return initialString + currProd.productName + " ";
                }, "")
            }
        },
        {
            field: "subtotal", 
            headerName: "Sub Total($)",
            type: 'number', 
            width: 120,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: "total", 
            headerName: "Total($)", 
            type: 'number',
            width: 120,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: "deliveryOption", 
            headerName: "Delivery", 
            width: 120, 
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: "deliveryAddress", 
            headerName: "Address", 
            width: 150,
            type: "string",
            headerAlign: 'center',
            valueGetter(params: GridValueGetterParams): String {
                return params.row.deliveryAddress.city;
            },
            align: 'center'
        },
        {
            field: "status", 
            headerName: "Status", 
            width: 100, 
            headerAlign: 'center',
            align: 'center'
        }
    ]
    
    return (
        <div className="adminHome">
            <div className="adminHome-sidebar">
                <AdminSidebar />
            </div>
            <div className="adminHome-main">     
                {
                    salesPurchases.length > 0 &&
                    <div className="featuredItems">
                        <FeaturedItem 
                            variableName="Sales"
                            variable={salesPurchases[salesPurchases.length - 1].sales}
                            changeInVariable = {((salesPurchases[salesPurchases.length - 1].sales - salesPurchases[salesPurchases.length - 2].sales)*100)/Math.abs(salesPurchases[salesPurchases.length - 1].sales)}
                        />
                        <FeaturedItem 
                            variableName="Purchases"
                            variable={salesPurchases[salesPurchases.length - 1].purchases}
                            changeInVariable = {((salesPurchases[salesPurchases.length - 1].purchases - salesPurchases[salesPurchases.length - 2].purchases)*100)/Math.abs(salesPurchases[salesPurchases.length - 1].purchases)}
                        />
                        <FeaturedItem 
                            variableName="Revenue"
                            variable={salesPurchases[salesPurchases.length - 1].revenue}
                            changeInVariable = {((salesPurchases[salesPurchases.length - 1].revenue - salesPurchases[salesPurchases.length - 2].revenue)*100)/Math.abs(salesPurchases[salesPurchases.length - 1].revenue)}
                        />
                    </div>
                }
                {salesPurchases.length > 0 && 
                    <LineChartTemplate 
                        title="1-year Sales, Purchases and Revenue Trend"
                        data={salesPurchases}
                        label="Amount($)"
                        labelPosition="center"
                        grid={true}
                    />
                }
                <div className="adminHome-main_salesListTitle">Sales Table</div>
                <div className="adminHome-main_salesList">
                    <div className="adminHome-main_salesListContainer">
                        <Box sx={{height: 400, width: '100%'}}>
                            <DataGrid
                                rows={sales}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        }
                                    }
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                disableRowSelectionOnClick
                                getRowId={(row) => String(row._id)}
                                sx={{
                                    fontSize: '16px', 
                                    textAlign: 'center',
                                    boxShadow: 2,
                                    borderColor: 'primary.dark',
                                    '& .MuiDataGrid-cell:hover': {
                                    color: 'primary.main',
                                    },
                                    m: 2
                                }}
                            />
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    )
}