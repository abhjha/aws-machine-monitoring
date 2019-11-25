import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
import SetpointTable from '../../Component/SetpointTable';
import graphImage from '../../Pages/RateOptimization/graph.png';

class RateOptimization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ["Ananlytics", "Rate Optimization"],
            predLine: ["Line", "3"],
            predAsset: ["Asset", "Blender"],
            predSummary: [],
            predDowntime: ["Primary Downtime Drivers", "Blender Failure", "Line Clog", "Outfeed Blockage"],
            rateOptiT1: ["55 RPM", "45 RPM", "35 RPM", "25 RPM"],
            rateOptiT2: ["25%", "11%", "4%", "7%"],
            rateOptiT3: ["$656K", "$367K", "$105K", "$236K"],
            rateOptiT4: ["$32.8M", "$18.3M", "$5.2M", "$11.8M"]
        }
    }

    render() {

        return (
            <div>
                <div className="tkey-header">
                    <BackButton />
                    <Breadcrumb pages={this.state.pages} />

                </div>
                <div className="data-container rate-opti">
                    <div className="pred-main-heading">
                        <div className="pred-main-title">
                            Rate Optimization
                  </div>
                        <div className="pred-main-details">
                            Insight: Setting blender speed between 30-38RPMs improves overall throughput and OEE by 7%
                  </div>
                    </div>
                    <div className="pred-main-graph">
                        <div className="pred-graph-details">
                            <SetpointTable data={this.state.predLine} /><SetpointTable data={this.state.predAsset} />
                        </div>
                        <div className="pred-graph-img">

                            <div className="setpoint-adjustements-heading">
                            Blender Rate vs OEE Cluster Analysis
                        </div>
                            <div className="pred-main-graph-image">
                                <img src={graphImage} />
                            </div>
                        </div>

                    </div>
                    <div className="pred-main-table">
                        <div className="pred-main-summary">
                            <div className="pred-summary-container">
                                <div className="sp-table-value summary-title">
                                    <div className="rate-opti-title">Blender <br /> Speed</div>
                                    <div className="rate-opti-title not-bold">OEE Loss (%) <br/> Target: 84%</div>
                                    <div className="rate-opti-title">Loss During Period <br />($)</div>
                                    <div className="rate-opti-title">Estimated Annual <br /> Loss ($)</div>
                                </div>
                                <div className="rate-opti-details">
                                    <SetpointTable data={this.state.rateOptiT1} /><SetpointTable data={this.state.rateOptiT2} /><SetpointTable data={this.state.rateOptiT3} /><SetpointTable data={this.state.rateOptiT4} />
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
export default withRouter(RateOptimization);