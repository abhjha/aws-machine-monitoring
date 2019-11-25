import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
import SetpointTable from '../../Component/SetpointTable';
import graphImage from '../../Pages/PredictiveMaintenace/graph.png';

class PredictiveMaintenace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ["Ananlytics", "Predictive Maintenance"],
            predLine: ["Line", "3"],
            predAsset: ["Asset", "Blender"],
            predSummary: [],
            predDowntime: ["Primary Downtime Drivers", "Blender Motor failure", "Blender Bearing Failure", "Blender Jam"],
            predSummaryHead: ["R"+"2".sup(), "Adjusted R2", "Observations", "Indicator Variables"],
            predSummaryDetails: ["79.7%", "81.6%", "1200", "Vibration Intensity"]
        }
    }

    render() {

        return (
            <div>
                <div className="tkey-header">
                    <BackButton />
                    <Breadcrumb pages={this.state.pages} />

                </div>
                <div className="data-container pred-main">
                    <div className="pred-main-heading card-tile">
                        <div className="pred-main-title">
                            Predictive Maintenance
                  </div>
                        <div className="pred-main-details">
                            Insight: When blender vibration on Line 3 hits the critical threshold it is estimated to have 500 hours remaining and an overhaul should be performed at next SKU changeover to avoid unexpected downtime
                  </div>
                    </div>
                    <div className="pred-main-graph">
                        <div className="pred-graph-details" >
                            <SetpointTable data={this.state.predLine} /><SetpointTable data={this.state.predAsset} />
                        </div>
                        <div className="pred-graph-img">

                            <div className="setpoint-adjustements-heading">
                                Line 3 Blender Motor Health
                        </div>
                            <div className="pred-main-graph-image">
                                <img src={graphImage} />
                            </div>
                        </div>

                    </div>
                    <div className="pred-main-table">
                        <div className="pred-main-summary">
                            <div className="pred-summary-container">
                                <div className="sp-table-value summary-title"> Model Summary Statistics</div>
                                <div className="pred-summary-details">
                                    <SetpointTable data={this.state.predSummaryHead} /><SetpointTable data={this.state.predSummaryDetails} />
                                </div>
                            </div>

                        </div>
                        <div className="pred-main-downtime">
                            <SetpointTable data={this.state.predDowntime} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(PredictiveMaintenace);