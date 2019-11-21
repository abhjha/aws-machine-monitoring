import React, { useState } from 'react';

function FinishedMixRatio (props){
    var totalValue = 100;
    // var classmix = "";
    // var displayRatio = "";
    // var ratioObject = {};
    // for (let [index, [key, value]] of Object.entries(Object.entries(props.data))) {
    //     var ratioValue = Math.round(value/totalValue * 100);
    //     ratioObject[key] = ratioValue;
    //     if(index == 0){
    //         displayRatio += ratioValue;
    //     }else{
    //         displayRatio += ":" + ratioValue;
    //     }
    // }

    return (
        <div className="mix-item-container">
            <div className="mix-ratio-header"><div className="mix-ratio-name">{props.name}</div><div className="ratio-value">{props.data + ":" + (100-props.data)}</div></div>
            <div className="mix-ratio-width"><div className="blue" style={{width:props.data + "%"}}></div><div className="green" style={{width: (100 - props.data) + "%"}}></div>
        </div> </div>
    )
}

export default FinishedMixRatio;