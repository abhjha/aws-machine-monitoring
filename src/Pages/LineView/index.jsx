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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var tableAlerts = 0;
var tableWarnings = 0;
var initialTableData = [];
var alarmsData = [];
//var lineAssetData = {};

class LineView extends Component {
    constructor(props) {
        super(props);
        //sessionStorage.autoRefreshState = "false";
        this.state = {
            pages: ['Plant View', sessionStorage.lineName],
            dropdownSelectedValue: 'Line 3',
            selectedLine: 'Line_3',
            dropdownOptions: [],
            tableData: [],
            DefectAnalysis: {},
            DowntimeDetails: {},
            lineData: {},
            lineAssetData: {},
            buttonLabel: 'START REFRESH',
            lineHeader: this.props.location.state.lineNameProps,
            autoRefreshStatus: '',
            autoRefreshState: sessionStorage.autoRefreshState === "false" ? false : true,
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
        if (assetID == "Bin") {
            this.props.history.push({
                pathname: '/binView',
                Component: { BinView },
                state: { assetID, lineHeader: this.props.location.state.lineNameProps, lineValue: this.props.location.state.lineID }
            });
        } else if (assetID == "Hopper") {
            this.props.history.push({
                pathname: '/hopperView',
                Component: { HopperView },
                state: { assetID, lineHeader: this.props.location.state.lineNameProps, lineValue: this.props.location.state.lineID }
            });
        } else if (assetID == "Blender") {
            this.props.history.push({
                pathname: '/blenderView',
                Component: { BlenderView },
                state: { assetID, lineHeader: this.props.location.state.lineNameProps, lineValue: this.props.location.state.lineID }
            });
        } else if (assetID == "Finished Goods") {
            this.props.history.push({
                pathname: '/finishedGoodsView',
                Component: { FinishedGoodsView },
                state: { assetID, lineHeader: this.props.location.state.lineNameProps, lineValue: this.props.location.state.lineID }
            });
        }
    }
    lineViewData = () => {
        const url = `https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=${sessionStorage.lineID}`;
        fetch(url)
            .then((response) => response.json())
            .then((goodsData) => {
                goodsData.currentValues.DamagedUnitCount = 3;
                goodsData.currentValues.DamagedCasesCount = 2;
                goodsData.currentValues.OverheatedCount = 1;
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
        return minutes + "m : " + (seconds < 10 ? '0' : '') + seconds + "s";
    }


    epochToDate = (dateVal) => {
        dateVal = parseInt(dateVal);
        var zone = "am";
        var date = new Date(dateVal).getDate();
        var monthName = new Date(dateVal).getMonth() + 1;
        var hours = new Date(dateVal).getHours();
        var mins = new Date(dateVal).getMinutes();
        if (hours > 12) {
            hours = hours - 12;
            zone = "pm";
        }
        mins = mins < 10 ? '0' + mins : mins;
        hours = hours < 10 ? '0' + hours : hours;

        return monthName + "/" + date + " " + hours + ":" + mins + zone;
    }


    //Alert Table Data
    triggerAlertTableData = () => {
        const url = `https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=${sessionStorage.lineID}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                tableAlerts = 0;
                tableWarnings = 0;
                //lineAssetData = data;
                initialTableData = alarmsData;
                alarmsData = [];
                for (let i = 0; i < data.alarms.length; i++) {
                    data.alarms[i].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.alarms[i].START_TIME));
                    data.alarms[i].Line = data.ASSET_NAME;
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
                        if (data.children[i].alarms.length > 0) {
                            data.children[i].alarms[j].Line = data.ASSET_NAME;
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
                if (initialTableData.length < alarmsData.length) {
                    var diffenceCount = alarmsData.length - initialTableData.length;
                    var initialLength = alarmsData.length;
                    for (let z = 0; z < diffenceCount; z++) {
                        this.notify(alarmsData[initialLength - z - 1].SEVERITY, alarmsData[initialLength - z - 1].Line, alarmsData[initialLength - z - 1].ASSET)
                    }
                }
                this.setState({
                    lineAssetData: data,
                    tableData: alarmsData,
                });
                // this.state.tableData = alarmsData;

            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, Alert table data')
            });
    }
    // setAutoRefresh = () => {
    //     clearInterval(this.apiTimerReferenceonload);
    //     this.setState((prevState)=> {
    //         const {autoRefreshState} = prevState;
    //         sessionStorage.autoRefreshState = autoRefreshState ? "false" : "true";

    //         return {
    //             autoRefreshState: !autoRefreshState,
    //             buttonLabel : !autoRefreshState ? 'STOP REFRESH' : "START REFRESH",
    //             autoRefreshStatus : !autoRefreshState ? 'auto-refresh' : "",
    //         }
    //     }, () => {
    //         if(this.state.autoRefreshState){
    //             this.apiTimerReference = setInterval(() => {
    //                 this.triggerAlertTableData();
    //                 this.lineViewData(); 
    //             }, 2000);
    //         } else {
    //             clearInterval(this.apiTimerReference);
    //         }
    //     });

    // }
    notify = (status, line, asset) => {
        var alertMessage = `${asset} Alert on ${line}`;
        var warningMessage = `${asset} Warning on ${line}`;
        if (status.toLowerCase() == "warning") {
            toast.warn(warningMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: false,

            });
        } else if (status.toLowerCase() == "alert") {
            toast.error(alertMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: false
            });
        }

    };
    componentDidMount() {
        // const responseHeader = {
        //   headers: {
        //     'X-API-KEY': 'k1AHdHjUI45HGsWfQasE28qqWT4nRflZ4q2rqNTw'
        //   }
        // };
        this.triggerAlertTableData();
        this.lineViewData();
        // if (sessionStorage.autoRefreshState === "true") {
            this.apiTimerReferenceonload = setInterval(() => {
                this.triggerAlertTableData();
                this.lineViewData();
            }, 2000);
            // this.setState(() => {
            //     return {
            //         autoRefreshState: true,
            //         buttonLabel: 'STOP REFRESH',
            //         autoRefreshStatus: 'auto-refresh',
            //     }
            // });
        

    }
    componentWillUnmount() {
        clearInterval(this.apiTimerReference);
        clearInterval(this.apiTimerReferenceonload);
        tableAlerts = 0;
        tableWarnings = 0;
        //sessionStorage.autoRefreshState= false;
    }
    render() {
        const { lineAssetData, dropdownOptions, pages, dropdownSelectedValue, lineData, autoRefreshStatus, buttonLabel, tableData } = this.state;
        return (
            <div>
                <div className="tkey-header">
                    <BackButton />
                    <Breadcrumb pages={pages} />
                    <div className="page-dropdown-heading">Line</div>
                    <Dropdown
                        options={dropdownOptions}
                        setDropdownSelectedValue={this.setDropdownSelectedValue}
                        dropdownselectedValue={dropdownSelectedValue}
                    />
                </div>

                <div className="data-container line-view">

                    <div className="line-header-values">
                        <LabelCard heading={"Line OEE"} value={lineData.OEE} />
                        <LabelCard heading={"Availability"} value={lineData.Availability} />
                        <LabelCard heading={"Performance"} value={lineData.Performance} />
                        <LabelCard heading={"Quality"} value={lineData.Quality} />
                    </div>
                    <div className="line-view-components">

                        <div className="line-assets card-tile">
                            <div className="line-view-heading">
                                <h3>Assets</h3>
                            </div>
                            {Object.keys(lineAssetData).length > 0 && <LineAsset data={lineAssetData} navigateAsset={this.navigateAsset} />}
                        </div>
                        <div className="line-view-adherence" data-id="finished-goods">
                            <ScheduleAdherence data={lineData} />
                        </div>
                        <div className="downtime-details card-tile">
                            <div className="line-view-heading">
                                <h3>Downtime Details</h3>
                            </div>
                            <DowntimeDetails data={this.state.DowntimeDetails} />
                        </div>
                        <div className="goods-data-container card-tile">
                            <div className="line-view-heading">
                                <h3>Defect Analysis</h3>
                            </div>
                            {Object.keys(this.state.DefectAnalysis).length > 0 && <DefectAnalysis data={Object.entries(this.state.DefectAnalysis)} />}
                        </div>
                    </div>
                    <div className="table-details-container card-tile">

                        {<DataTableComponent filteredData={tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />}
                        {/* <button className={"refresh-button " + autoRefreshStatus} onClick={this.setAutoRefresh}>{buttonLabel}</button>  */}
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    }
}
export default withRouter(LineView);