import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Dropdown from '../../Component/Dropdown';
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import alert from '../../Images/alert.png';
import LabelCard from '../../Component/LabelCard'
import warning from '../../Images/warning.png';
import DowntimeDetails from '../../Component/DowntimeDetails'
import DefectAnalysis from '../../Component/DefectAnalysis';
import ScheduleAdherence from '../../Component/ScheduleAdherence';
import LineAsset from '../../Component/LineAsset';
import BlenderView from '../../Pages/BlenderView/index';
import FinishedGoodsView from '../../Pages/FinishedGoodsView/index';
import BinView from '../../Pages/BinView/index';
import HopperView from '../../Pages/HopperView/index';
var tableAlerts = 0;
var tableWarnings = 0;
var lineAssetData = {};
class LineView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ['Plant View', "Paint Shop"],
            dropdownSelectedValue: 'Paint Shop',
            selectedLine: 'Line_3',
            dropdownOptions: [],
            tableData: [],
            DefectAnalysis: {},
            DowntimeDetails: {},
            lineData: {},
            lineAssetData: {},

        }
    }

    setDropdownSelectedValue = (e) => {
        const dropdownSelectedValue = e.currentTarget.getAttribute('data-value');
        //this.setState({ dropdownSelectedValue });
        if (dropdownSelectedValue === 'Hopper') {
            this.props.history.push({ pathname: '/hopperView' });
        } else if (dropdownSelectedValue === 'Bin') {
            this.props.history.push({ pathname: '/binView' });
        } else if (dropdownSelectedValue === 'Blender') {
            this.props.history.push({ pathname: '/blenderView' });
        }
    }
    navigateAsset = (e) => {
        const assetID = e.currentTarget.getAttribute('data-id');
        if (assetID == "SN005" || assetID == "SN006") {
            this.props.history.push({
                pathname: '/binView',
                Component: { BinView },
                state: { assetID, lineValue: this.props.location.state.lineID }
            });
        } else if (assetID == "SN002" || assetID == "SN001") {
            this.props.history.push({
                pathname: '/hopperView',
                Component: { HopperView },
                state: { assetID, lineValue: this.props.location.state.lineID }
            });
        } else if (assetID == "SN003") {
            this.props.history.push({
                pathname: '/blenderView',
                Component: { BlenderView },
                state: { assetID, lineValue: this.props.location.state.lineID }
            });
        } else if (assetID == "SN004") {
            this.props.history.push({
                pathname: '/finishedGoodsView',
                Component: { FinishedGoodsView },
                state: { assetID, lineValue: this.props.location.state.lineID }
            });
        }
    }
    lineViewData = () => {
        const url = `https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=${this.props.location.state.lineID}`;
        fetch(url)
            .then((response) => response.json())
            .then((goodsData) => {
                this.setState({
                    DefectAnalysis: (({ DamagedUnitCount, DamagedCasesCount, OverheatedCount, MixRatioOutOfSpecCount, ImpurityCount }) => ({ DamagedUnitCount, DamagedCasesCount, OverheatedCount, MixRatioOutOfSpecCount, ImpurityCount }))(goodsData.currentValues),
                    lineData: goodsData.currentValues,
                    DowntimeDetails: (({ BlenderDown, LineClog, BinDown, HopperDown, OutfeedClog }) => ({ BlenderDown, LineClog, BinDown, HopperDown, OutfeedClog }))(goodsData.currentValues),
                })
            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, Alert summary data')
            });
    }

    millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + " m " + (seconds < 10 ? '0' : '') + seconds + "s";
    }
    epochToDate = (dateVal) => {
        var date = new Date(parseFloat(dateVal.substr(6)));
        return (
            (date.getMonth() + 1) + "/" +
            date.getDate() + "/" +
            date.getFullYear() + " " +
            date.getHours() + ":" +
            date.getMinutes() + ":" +
            date.getSeconds()
        );
    }

    //Alert Table Data
    triggerAlertTableData = () => {
        const url = `https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=${this.props.location.state.lineID}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                lineAssetData = data;
                var alarmsData = [];
                for (let i = 0; i < data.alarms.length; i++) {
                    data.alarms[i].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.alarms[i].START_TIME));
                    data.alarms[i].Line = data.alarms[i].ASSET;
                    data.alarms[i].START_TIME = this.epochToDate(data.alarms[i].START_TIME);
                    if (data.alarms[i].SEVERITY == "Alert") {
                        data.alarms[i]["statusBox"] = <img src={alert} />;
                        tableAlerts++;
                    } else {
                        data.alarms[i]["statusBox"] = <img src={warning} />;
                        tableWarnings++;
                    }
                    alarmsData.push(data.alarms[i]);
                }
                for (let i = 0; i < data.children.length; i++) {
                    for (let j = 0; j < data.children[i].alarms.length; j++) {
                        if (data.alarms.length > 0) {
                            data.children[i].alarms[j].Line = data.alarms[0].ASSET;
                        } else {
                            data.children[i].alarms[j].Line = "";
                        }
                        data.children[i].alarms[j].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.children[i].alarms[j].START_TIME));
                        data.children[i].alarms[j].START_TIME = this.epochToDate(data.children[i].alarms[j].START_TIME);
                        if (data.children[i].alarms[j].SEVERITY == "Alert") {
                            data.children[i].alarms[j]["statusBox"] = <img src={alert} />;
                            tableAlerts++;
                        } else {
                            data.children[i].alarms[j]["statusBox"] = <img src={warning} />;
                            tableWarnings++;
                        }
                        alarmsData.push(data.children[i].alarms[j]);
                    }
                }
                this.setState({

                    tableData: alarmsData,
                });

            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, Alert table data')
            });
    }
    componentDidMount() {
        // const responseHeader = {
        //   headers: {
        //     'X-API-KEY': 'k1AHdHjUI45HGsWfQasE28qqWT4nRflZ4q2rqNTw'
        //   }
        // };
        this.triggerAlertTableData();
        this.lineViewData();

    }

    render() {
        return (
            <div className="data-container line-view">
                <div className="tkey-header">
                    <BackButton />
                    <Breadcrumb pages={this.state.pages} />
                    <div className="page-dropdown-heading">Department</div>
                    <Dropdown
                        options={this.state.dropdownOptions}
                        setDropdownSelectedValue={this.setDropdownSelectedValue}
                        dropdownselectedValue={this.state.dropdownSelectedValue}
                    />
                </div>
                <div className="line-header">Department</div>
                <div className="line-header-values">
                    <LabelCard heading={"Department OEE"} value={this.state.lineData.OEE} />
                    <LabelCard heading={"Availability"} value={this.state.lineData.Availability} />
                    <LabelCard heading={"Performance"} value={this.state.lineData.Performance} />
                    <LabelCard heading={"Quality"} value={this.state.lineData.Quality} />
                </div>
                <div className="line-view-components">

                    <div className="line-assets card-tile">
                        <div className="line-view-heading">
                            Assets
                        </div>
                        {Object.keys(lineAssetData).length > 0 && <LineAsset data={lineAssetData} navigateAsset={this.navigateAsset} />}
                    </div>
                    <div className="line-view-adherence" data-id="SN004" onClick={(e)=>this.navigateAsset(e)}>
                    <ScheduleAdherence data={this.state.lineData} />
                    </div>
                    <div className="downtime-details card-tile">
                        <div className="line-view-heading">
                            Downtime Details
                        </div>
                        <DowntimeDetails data={this.state.DowntimeDetails} />
                    </div>
                    <div className="goods-data-container card-tile">
                        <div className="finished-goods-rate-heading">
                            Defect Analysis
                            </div>
                        {Object.keys(this.state.DefectAnalysis).length > 0 && <DefectAnalysis data={Object.entries(this.state.DefectAnalysis)} />}
                    </div>
                </div>
                <div className="table-details-container card-tile">

                    <DataTableComponent filteredData={this.state.tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />
                </div>
            </div>
        );
    }
}
export default withRouter(LineView);