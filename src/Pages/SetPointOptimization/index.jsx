import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
import SetpointTable from '../../Component/SetpointTable';
import ambTemp from '../../Pages/SetPointOptimization/ambTemp.png';
import ambHum from '../../Pages/SetPointOptimization/ambHum.png';
import SpAsset from '../../Component/SpAsset';
import heatmap from '../../Pages/SetPointOptimization/heatmap.png';
class SetPointOptimzation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ["Ananlytics", "Setpoint Optimization"],
            setpointSKU: ["SKU", "41787KC"],
            setpointAmbTemp: ["Ambient Temperature"],
            setpointHum: ["Ambient Humidity"],
            spHopper: {
                "Mix Ratio Setpoint": "-3",
                "Blue Hopper Setpoint": "-4",
                "Green Hopper Setpoint": "-6",
                "Blue Fill Rate": "4",
                "Green Fill Rate": "4",
            },
            spBlender: {
                "Blender Speed": "4",
                "Blender Zone 1 Temp": "-5",
                "Blender Zone 2 Temp": "-9",
                "Blender Zone 3 Temp": "-8",
                "Blender Zone 4 Temp": "-6",
            }
        }
    }

    render() {

        return (
            <div>
                <div className="tkey-header">
                    <BackButton />
                    <Breadcrumb pages={this.state.pages} />

                </div>
                <div className="data-container setpoint-view">
                    <div className="setpoint-heading card-tile">
                        <div className="setpoint-title">
                            Setpoint Optimization
                        </div>
                        <div className="setpoint-details">
                            Insight : When ambient conditions exceed analytics-defined thresholds, setpoints should be adjusted to optimize the process and reduce scrap based on machine learning models
                        </div>
                    </div>
                    <div className="setpoint-data">
                        <div className="setpoint-temp card-tile">
                            <div className="setpoint-sku">
                                <SetpointTable data={this.state.setpointSKU} />
                            </div>
                            <div className="setpoint-amb-temp">
                                <SetpointTable data={this.state.setpointAmbTemp} /> <div className="sp-table-value sp-image"><img src={ambTemp} /></div>
                            </div>
                            <div className="setpoint-amb-hum">
                                <SetpointTable data={this.state.setpointAmbTemp} /><div className="sp-table-value sp-image"><img src={ambHum} /></div>
                            </div>
                        </div>
                        <div className="setpoint-adjustments card-tile">
                            <div className="setpoint-adjustements-heading">
                                Recommended Setpoint Adjustments
                        </div>
                            <div className="setpoint-asset-data">
                                <SpAsset data={Object.entries(this.state.spHopper)} heading={"Hopper"} /><SpAsset data={Object.entries(this.state.spBlender)} heading={"Blender"} />
                            </div>
                            <div className="setpoint-graph">
                                <div className="sp-oee">
                                    <div className="setpoint-adjustements-heading">
                                        +6%
                                </div>
                                    <div className="setpoint-adjustements-heading">
                                        Cumulative OEE Impact
                                </div>

                                </div>
                                <div className="sp-heatmap">
                                    <div className="setpoint-adjustements-heading">
                                        Heat Map Key
                                    </div>
                                    <div className="sp-heatmap-image">
                                        <img src={heatmap} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(SetPointOptimzation);