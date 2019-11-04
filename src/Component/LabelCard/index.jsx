import React, { useState } from 'react';
import './index.css';


function LabelCard (props){
    return (
        <div className="label-container">
            <div className="label-heading">
                {props.heading}
            </div>
            <div className="label-value">
                {(parseFloat(props.value).toFixed(2)*100 + "%")}
            </div>
        </div>
    )
}

export default LabelCard;