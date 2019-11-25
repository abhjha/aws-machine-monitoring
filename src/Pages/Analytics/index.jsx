import React from 'react';
import { withRouter } from "react-router-dom";
import AnalyticsDetails from '../../Component/AnalyticsDetails';
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
class AnalyticsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ["Ananlytics"]
        }
    }
    // naviagteRowAnalysis = (e) =>{
    //     if(e.currentTarget.innerHTML == "Labor Correlation"){
    //         this.props.history.push({ pathname: '/laberCorrelation' });
    //     }
    // }
    navigateAnalysis = (e) => {
        const selectedDiv = e.currentTarget.getAttribute('data-value');
        //this.setState({ dropdownSelectedValue });
        if (selectedDiv == 'Labor Correlation') {
            this.props.history.push({
                pathname: '/laborCorrelation'
            });
        } else if (selectedDiv === 'Setpoint Optimization') {
            this.props.history.push({
                pathname: '/setpointOptimization'
            });
        } else if (selectedDiv === 'Predictive Maintenance') {
            this.props.history.push({
                pathname: '/predictiveMaintenace'
            });
        } else if (selectedDiv === 'Rate Optimization') {
            this.props.history.push({
                pathname: '/rateOptimization'
            });
        }
        else if (selectedDiv === 'Raw Material Insights') {
            this.props.history.push({
                pathname: '/rawMaterial'
            });
        }
    }
    render() {
        return (
            <div>
                <div className="tkey-header">
                    <BackButton />
                    <Breadcrumb pages={this.state.pages} />

                </div>
                <div className="data-container analytics-view">


                    <div className="analytics-container card-tile">
                        <div className="analytics-heading">
                            Operational Insights
                </div>
                        <AnalyticsDetails
                            navigateAnalysis={this.navigateAnalysis} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(AnalyticsView);