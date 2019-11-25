import React, { useState } from 'react';


function SpAsset (props){
    function getBackgroundColor (value){
        value = parseInt(value);
        if((value > 4 || value < -4) && value >= -6){
            return "orange";
        }
        if(value < -6){
            return "red";
        }
        else{
            return "";
        }
    }
    return (
        <div className="sp-asset-container">
            <div className="sp-asset-container-heading">
                {props.heading}
            </div>
            <div className="sp-asset-heading">
                <div className="sp-setpoint">
                    Setpoint
                </div>
                <div className="sp-adjustment">
                   Adjustment
                </div>
            </div>
            <div className="sp-asset-details">
                {props.data.map(item=> <div className="sp-asset-details-container"><div className="sp-asset-info">{item[0]}</div><div className={"sp-asset-value " + getBackgroundColor(item[1])}>{item[1]+"%"}</div></div>)}
            </div>
        </div>
        
    )
}

export default SpAsset;