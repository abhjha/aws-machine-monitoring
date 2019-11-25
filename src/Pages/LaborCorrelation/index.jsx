import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
import scrap from '../../Pages/LaborCorrelation/scrap.png';
import setpoint from '../../Pages/LaborCorrelation/setpoint.png';
import assessment from '../../Pages/LaborCorrelation/assessment.png';
import tableGraph from '../../Pages/LaborCorrelation/table.png';
class LaborCorrelation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ["Ananlytics", "Labor Correlation"]
        }
    }

    render() {
        return (
            <div >
                <div className="tkey-header">
                    <BackButton />
                    <Breadcrumb pages={this.state.pages} />

                </div>
                <div className="data-container labor-analytics-view">
                <div className="labor-correlation-heading">
                    <div className="labor-correlation-title">
                        Labor Correlation
                  </div>
                    <div className="labor-correlation-details">
                        Insight: When Crew A is clocked in, setpoints are adjusted more frequently and there is a 64% higher probability of scrap being generated
                  </div>
                </div>
                <div className="labor-correlation-table">
                    <div className="labor-correlation-oee">
                        <div className="labor-graph-heading">
                            OEE by Crew
                        </div>
                        <div className="labor-graph-image">
                        <img src={tableGraph} />
                        </div>
                    </div>
                    <div className="labor-correlation-setpoint">
                        <div className="labor-graph-heading">
                            Setpoint change count per shift
                        </div>
                        <div className="labor-graph-image">
                            <img src={setpoint} />
                        </div>
                    </div>
                </div>
                <div className="labor-correlation-graph">
                    <div className="labor-correlation-scrap">
                        <div className="labor-graph-heading">
                            Monthly Scrap by Crew
                        </div>
                        <div className="labor-graph-image">
                            <img src={scrap} />
                        </div>
                    </div>
                    <div className="labor-correlation-assessment">
                        <div className="labor-graph-heading">
                            Monthly Assessment of Unplanned Downtime
                        </div>
                        <div className="labor-graph-image">
                            <img src={assessment} />
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}
export default withRouter(LaborCorrelation);