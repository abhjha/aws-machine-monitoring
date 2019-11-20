import React from 'react';



function DowntimeDetails(props) {
    function getHoursAndMinutes(d) {
        var 
        minutes = Math.floor((d / (1000 * 60)) % 60),
        hours = Math.floor((d / (1000 * 60 * 60)) % 24);
    
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      
    
      return hours  + " h : " + minutes + " m" ;
    }
    function getTextValue(data) {
        var displayHeading = "";
        switch (data) {
            case "BlenderDown":
                displayHeading = "Blender Equipment Failure";
                break;
            case "LineClog":
                displayHeading = "Line Clog";
                break;
            case "BinDown":
                displayHeading = "Material Shortage";
                break;
            case "HopperDown":
                displayHeading = "Hopper Discharge Jam";
                break;
            case "OutfeedClog":
                displayHeading = " Outfeed Line Clog";
                break;
            default:
                displayHeading = "";
        }
        return displayHeading;
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