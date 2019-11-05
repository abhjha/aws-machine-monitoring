import React from 'react';
import './index.css';


function DowntimeDetails(props) {
    return (
        <div className="downtime-container">
            <div className="downtime-row heading">
               <div className="value-label">Description</div>
               <div className="value-value">Time</div>
            </div>
            {Object.entries(props.data).map(item => <div className="downtime-row value"><div className="value-label"> {item[0]}</div><div className="value-value">{item[1]} </div> </div>)}
        </div>
    )
}

export default DowntimeDetails;