import React from 'react';

var tabledata = [{
    Analysis : "Labor Correlation",
    Insights : "When crew A is locked in, setpoints are adjusted more frequently and there is a 28% higher probability of scrap being generated",
    APQ : "AQ"
},
{
    Analysis : "Setpoint Optimization",
    Insights : "When ambient conditions exceed analytics-defined thresholds, setpoints should be adjusted to optimize the process and reduce scrap based on machine learning models ",
    APQ : "AQ" 
},
{
    Analysis : "Predictive Maintenance",
    Insights : "When blender vibration on Line 3 hits the critical threshold it is estimated to have 500 hours remaining and an overhaul should be performed at next SKU changeover to avoid unexpected downtime ",
    APQ : "A" 
},
{
    Analysis : "Rate Optimization",
    Insights : "Setting blender speed between 30-38RPMs improves overall throughput and OEE by 7% ",
    APQ : "PQ" 
},
{
    Analysis : "Raw Material Insights",
    Insights : "Utilizing Brand X as the primary source of materials can increase profit by $91 K on Line 4 monthly ",
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