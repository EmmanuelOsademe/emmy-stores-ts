import "./adminSales.css";
import React, { useState, useEffect, useContext } from "react";
import { AdminSidebar } from "../../components/adminSidebar/AdminSidebar";
import { Context } from "../../context/Context";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffectOnce } from "../../hooks/useEffectOnce";

export const AdminSales: React.FC = () => {
    const {baseUrl} = useContext(Context);

    const [salesData, setSalesData] = useState<any[]>([]);
  
    useEffectOnce(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        }

        fetch(`${baseUrl}/admin/monthly-sales`, requestOptions)
            .then(res => res.json())
            .then(data => setSalesData(data))
    })
    
    /*useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        }

        fetch(`${baseUrl}/admin/monthly-sales`, requestOptions)
            .then(res => res.json())
            .then(data => setSalesData(data))
    }, [])*/

    console.log(salesData);

    return (
        <div className="adminSales">
            <div className="adminSales-sidebar">
                <AdminSidebar />
            </div>
            <div className="adminSales-main">
                {salesData.length > 0 && 
                    <>
                        <ResponsiveContainer width="100%" height={300}>
                        <AreaChart 
                            width={500}
                            height={300}
                            data={salesData[1]?.data}
                            syncId="anyId"
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey={Object.keys(salesData[1]?.data[0])[0]}/>
                            <YAxis />
                            <Tooltip />
                            <Area 
                                type="monotone" 
                                dataKey={Object.keys(salesData[1]?.data[0])[2]} 
                                stroke="#82ca9d" 
                                fill="#82ca9d"
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart 
                        width={500}
                        height={300}
                        data={salesData[1]?.data}
                        syncId="anyId"
                        margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey={Object.keys(salesData[1]?.data[0])[0]}/>
                        <YAxis />
                        <Tooltip />
                        <Line 
                            type="monotone" 
                            dataKey={Object.keys(salesData[1]?.data[0])[1]} 
                            stroke="#82ca9d" 
                            fill="#82ca9d"
                        />
                    </LineChart>
                    </ResponsiveContainer>
                    </>
                    
                }
            </div>
        </div>
    )
}