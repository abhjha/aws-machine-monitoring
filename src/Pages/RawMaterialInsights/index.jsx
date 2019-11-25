import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
import SetpointTable from '../../Component/SetpointTable';
import graphImage from '../../Pages/RawMaterialInsights/graph.png';
import barImage from '../../Pages/RawMaterialInsights/bar.png';

class RawMaterialInsights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ["Ananlytics", "Raw Material Insights"],
            predLine: ["Line", "4"],
            predAsset: ["SKU", "0190234"],
            predSummary: [],
            predDowntime: ["Primary Downtime Drivers", "Blender failure", "Line Clog", "Outfeed Blockage"],
            rawMatT1: ["Brand","Brand X","Brand Y","Brand Z"],
            rawmatT2: ["Cost Per LB", "$0.37","$0.35","$0.25"],
            
        }
    }

    render() {

        return (
            <div>
                <div className="tkey-header">
                    <BackButton />
                    <Breadcrumb pages={this.state.pages} />

                </div>
                <div className="data-container raw-mat">
                <div className="pred-main-heading">
                    <div className="pred-main-title">
                        Raw Material Insights
                  </div>
                    <div className="pred-main-details">
                        Insight: Utilizing Brand X as the primary source of materials can increase profit by $91 K on Line 4 monthly
                  </div>
                </div>
                <div className="pred-main-graph">
                    <div className="pred-graph-details">
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
                        
                            
                            <div className="pred-summary-details">
                                <div className="raw-mat-table-head"><SetpointTable data={this.state.rawMatT1} /></div><div className="raw-mat-table-value"><SetpointTable data={this.state.rawmatT2} /></div>
                            </div>
                        

                    </div>
                    <div className="pred-main-downtime">
                    <div className="setpoint-adjustements-heading">
                            Projected Monthly Profit per Blend
                        </div>
                        <div className="raw-mat-bar"><img src={barImage}/></div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}
export default withRouter(RawMaterialInsights);