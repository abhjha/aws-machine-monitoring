import React from 'react';
import './index.css';


var time = (props) => {
    var className = "";
    if (props.value >= 0 && props.value <= 60) {
        className = "orange"
    } else if (props.value > 60) {
        className = "#05C985"
    } else {
        className = "#EE423D"
    }
    return (
        <div className="bin-component" >
            <div className='bins'>
                <div className="bin-heading">{props.binName}</div>
                <div className='time-duration-for-bins' style={{ color: className }}>{props.value}</div>
            </div>
        </div>
    )
};
export default time;