import "./Rating.css";
import React, {CSSProperties, useState} from 'react';
import {StarOutline, Star} from '@mui/icons-material';

interface Props {
    rating: number;
    onClick: (index: number) => void;
    style?: CSSProperties
}

export const Rating: React.FC<Props> = ({rating, onClick, style}) => {
    return (
        <div className="rating">
            <div className="rating-icons-container">
                {
                    [...Array(5)].map((_, index) => {
                        return (
                            <span 
                                key={index} 
                                onClick={() => onClick(index)}
                                style={style}
                            >
                                {rating > index ? <Star className="rating-icons" /> : <StarOutline className="rating-icons" />}
                            </span>
                        )
                    })
                }
            </div>
        </div>
    )
}