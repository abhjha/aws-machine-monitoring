import React from 'react';



function DowntimeDetails(props) {
    function getHoursAndMinutes(d) {
        var 
        minutes = Math.floor((d / (1000 * 60)) % 60),
        hours = Math.floor((d / (1000 * 60 * 60)) % 24);
    
        var hDisplay = h > 0 ? h + "h" : "";
        var mDisplay = m > 0 ?" : " + m + "m" : " : 00m";
        return hDisplay + mDisplay ; 
    }
    return (
        <div className="downtime-container">
            <div className="downtime-row heading">
                <div className="value-label">Details</div>
                <div className="value-value">Time</div>
            </div>
            {Object.entries(props.data).map(item => <div className="downtime-row value"><div className="value-label"> {getTextValue(item[0])}</div><div className="value-value">{getHoursAndMinutes(item[1])} </div> </div>)}
        </div>
    )
}

export default DowntimeDetails;