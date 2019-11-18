import React from 'react';



function DowntimeDetails(props) {
    function getHoursAndMinutes(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
    
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
            {Object.entries(props.data).map(item => <div className="downtime-row value"><div className="value-label"> {item[0]}</div><div className="value-value">{getHoursAndMinutes(item[1])} </div> </div>)}
        </div>
    )
}

export default DowntimeDetails;