import React from 'react';

function ScheduleAdherence(props) {
    var sacolor ="";
    if(props.data.ScheduleAdherence < 50){
        sacolor="red";
    }else if (props.data.ScheduleAdherence >=50 && props.data.ScheduleAdherence  <90){
        sacolor ="orange";
    }else if (props.data.ScheduleAdherence >=90){
        sacolor ="green";
    }
    return (
        <div className="adherence-container card-tile">
            <div className="adherence-heading">
                <div className="adherence-label-main">Schedule Adherence</div> <div className={"adherence-value-main " + sacolor}><h3 >{Math.round(props.data.ScheduleAdherence) + "%"}</h3></div>
            </div>
            <div className="current-adherence">
                <div className="current-heading">Current</div>
                <div className="value-container">
                    <div className="adherence-label">Units Completed</div> <div className="adherence-value">{props.data.CasesComplete}</div>
                </div>
            </div>
            <div className="end-adherence">
                <div className="end-adherence-heading">By End of Shift</div>
                <div className="value-container">
                    <div className="adherence-label">Forecasted Units</div> <div className="adherence-value">{props.data.ForecastedOutput}</div>
                </div>
                <div className="value-container">
                    <div className="adherence-label">Planned Units</div> <div className="adherence-value">{props.data.PlannedOutput}</div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleAdherence;