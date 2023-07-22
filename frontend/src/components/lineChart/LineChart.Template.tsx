import "./lineChart.css";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface Props {
    title: string;
    data: any[];
    label: string;
    labelPosition: string;
    grid: boolean;
}

export const LineChartTemplate: React.FC<Props> = ({title, data, label, labelPosition, grid}) => {
    
    return (
        <div className="lineChart">
            <div className="lineChartTitle">{title}</div>
            <ResponsiveContainer width="100%" aspect={3/1}>
                <LineChart 
                    data={data}
                    margin={{top: 5, right: 30, left: 20, bottom: 15}}
                >
                    <XAxis 
                        dataKey={Object.keys(data[0])[0]} 
                        stroke="#5550bd"
                    />
                    <YAxis label={{value: label, angle: -90, position: labelPosition}}/>
                    <Line type="monotone" dataKey={Object.keys(data[0])[1]} stroke="#1376bc" strokeWidth={1.5}/>
                    <Line type="monotone" dataKey={Object.keys(data[0])[2]} stroke="#55866e" strokeWidth={1.5}/>
                    <Line type="monotone" dataKey={Object.keys(data[0])[3]} stroke="#80273d" strokeWidth={1.5} activeDot={{ r: 4 }}/>
                    <Tooltip />
                    <Legend verticalAlign="top"/>
                    {grid && <CartesianGrid stroke="#555" strokeDasharray={1/1}/>}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}