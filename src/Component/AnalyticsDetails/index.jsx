import React, { useState } from 'react';
import './index.css';

var tabledata = [{
    Analysis : "Labor Correlation",
    Insights : "When crew A is locked in, setpoints are adjusted more frequently and there is a 28% higher probability of scrap being generated",
    APQ : "AQ"
},
{
    Analysis : "Setpoint Optimization",
    Insights : "When crew A is locked in, setpoints are adjusted more frequently and there is a 28% higher probability of scrap being generated",
    APQ : "AQ" 
},
{
    Analysis : "Predictive Maintenance",
    Insights : "When crew A is locked in, setpoints are adjusted more frequently and there is a 28% higher probability of scrap being generated",
    APQ : "AQ" 
},
{
    Analysis : "Rate Optimization",
    Insights : "When crew A is locked in, setpoints are adjusted more frequently and there is a 28% higher probability of scrap being generated",
    APQ : "AQ" 
},
{
    Analysis : "Raw Material Insights",
    Insights : "When crew A is locked in, setpoints are adjusted more frequently and there is a 28% higher probability of scrap being generated",
    APQ : "AQ" 
}]


function AnalyticsDetails (props){
    return (
        <div className="analytics-navigator-container">
            <div className="analytics-header-contaier">
            <div className="analytics-anaylisis">Analysis </div>
            <div className="analytics-insights"> Insights</div>
            <div className="analytics-apq">APQ </div>
            </div>
           {tabledata.map(item => <div className="analysis-row-contaienr" data-value={item.Analysis} onClick={(e)=> props.navigateAnalysis(e)}><div className="analytics-anaylisis">{item.Analysis} </div><div className="analytics-insights"> {item.Insights}</div><div className="analytics-apq">{item.APQ} </div></div>)}
        </div>
    )
}

export default AnalyticsDetails;