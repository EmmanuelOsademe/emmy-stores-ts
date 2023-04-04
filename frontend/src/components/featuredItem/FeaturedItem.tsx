import "./featuredItem.css";
import React from 'react';
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
    variableName: string;
    variable: number;
    changeInVariable: number
}

export const FeaturedItem: React.FC<Props> = ({variableName, variable, changeInVariable}) => {
    return (
        <div className="featuredItem">
            <span className="featuredItemMain">{variableName}: {formatCurrency(variable)}</span>
            <div className="featuredItemSub">
                <span className="featuredItemRate">
                    {(changeInVariable).toFixed(2)}% {changeInVariable >= 0 ?
                        <ArrowUpward className="featuredItemIcon"/> :
                        <ArrowDownward className="featuredItemIcon negative"/>
                    }
                </span>
                <span className="featuredItemRef">Compared to last month</span>
            </div>
        </div>
    )
}