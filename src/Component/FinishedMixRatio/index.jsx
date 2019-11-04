import React, { useState } from 'react';
import './index.css';

function FinishedMixRatio (props){
    var totalValue = Object.values(props.data).reduce((a,b) => a+b ,0);
    var classmix = "";
    var displayRatio = "";
    var ratioObject = {};
    for (let [index, [key, value]] of Object.entries(Object.entries(props.data))) {
        var ratioValue = Math.round(value/totalValue * 100);
        ratioObject[key] = ratioValue;
        if(index == 0){
            displayRatio += ratioValue;
        }else{
            displayRatio += ":" + ratioValue;
        }
    }

    return (
        <div className="mix-item-container">
            <div className="mix-ratio-header"><div className="mix-ratio-name">{props.name}</div><div className="ratio-value">{displayRatio}</div></div>
            <div className="mix-ratio-width">{Object.entries(ratioObject).map( item => <div className={(item[0].toLowerCase().includes('blue')) ? 'blue' : 'green'} style={{width:item[1]+'%'}}></div>)}
        </div> </div>
    )
}

export default FinishedMixRatio;