import "./Rating.css";
import React, {useState} from 'react';
import {StarOutline, Star} from '@mui/icons-material';

interface Props {
    ProductRating: number;
}

export const Rating: React.FC<Props> = ({ProductRating}) => {
    const [rating, setRating] = useState<Number>(ProductRating | 3)
    return (
        <div className="rating">
            {/*<span className="rating-title">Rating</span>*/}
            <div className="rating-icons-container">
                {
                    [...Array(5)].map((_, index) => {
                        return (
                            <span key={index} >
                                {rating > index ? <Star className="rating-icons"/> : <StarOutline className="rating-icons" />}
                            </span>
                        )
                    })
                }
            </div>
        </div>
    )
}