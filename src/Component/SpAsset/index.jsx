import React, { useState } from 'react';
import './index.css';


function SpAsset (props){
    return (
        <div className="sp-asset-container">
            <div className="sp-asset-container-heading">
                {props.heading}
            </div>
            <div className="sp-asset-heading">
                <div className="sp-setpoint">

                </div>
                <div className="sp-adjustment">

                </div>
            </div>
            <div className="sp-asset-details">
                {props.data.map(item=> <div className="sp-asset-details-container"><div className="sp-asset-info">{item[0]}</div><div className="sp-asset-value">{item[1]}</div></div>)}
            </div>
        </div>
        
    )
}

export default SpAsset;