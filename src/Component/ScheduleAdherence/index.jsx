import React from 'react';

function ScheduleAdherence(props) {
    return (
        <div className="adherence-container card-tile">
            <div className="adherence-heading">
                <div className="adherence-label-main"><h3>Schedule Adherence</h3></div> <div className="adherence-value-main"><h1>{Math.round(props.data.ScheduleAdherence)}</h1></div>
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