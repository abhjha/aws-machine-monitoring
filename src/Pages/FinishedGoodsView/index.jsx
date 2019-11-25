import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Dropdown from '../../Component/Dropdown';
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import alert from '../../Images/alert.png';
import { Bar } from 'react-chartjs-2';
import warning from '../../Images/warning.png';
import FinishedMixRatio from '../../Component/FinishedMixRatio';
import DefectAnalysis from '../../Component/DefectAnalysis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var tableAlerts = 0;
var tableWarnings = 0;
var initialTableData = [];
var alarmsData = [];
class FinishedGoodsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ['Plant View', sessionStorage.lineName, 'Finished Goods View'],
            dropdownSelectedValue: 'Finished Goods View',
            selectedLine: 'Line_3',
            dropdownOptions: ['Bin', 'Hopper', 'Blender', 'Finished Goods View'],

            tableData: [],
            graphData: {
                labels: [],
                datasets: [{
                    label: "",
                    backgroundColor: ['#1F8EFA', '#C31FFA'],
                    borderColor: 'rgb(255, 99, 132)',
                    data: [],
                }]
            },
            DefectAnalysis: {},
            MixRatio: {},
            TargetMix: {},
            HopperMix: {},
            FinishedGoodsMix: {},
            buttonLabel: 'START REFRESH',
            autoRefreshStatus: '',
            autoRefreshState: sessionStorage.autoRefreshState === "true" ? true : false,
        }
    }

    setDropdownSelectedValue = (e) => {
        const dropdownSelectedValue = e.currentTarget.getAttribute('data-value');
        //this.setState({ dropdownSelectedValue });
        if (dropdownSelectedValue === 'Hopper') {
            this.props.history.push({
                pathname: '/hopperView',
                state: { lineValue: this.props.location.state.lineValue },
            });
        } else if (dropdownSelectedValue === 'Bin') {
            this.props.history.push({
                pathname: '/binView',
                state: { lineValue: this.props.location.state.lineValue },
            });
        } else if (dropdownSelectedValue === 'Blender') {
            this.props.history.push({
                pathname: '/blenderView',
                state: { lineValue: this.props.location.state.lineValue },
            });
        }
    }

    finishedGoodsViewData = () => {

        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=SN004&lengthOfHistory=5')
            .then((response) => response.json())
            .then((goodsData) => {
                console.log(goodsData);
                this.setState({
                    DefectAnalysis: (({ DamagedUnitCount, DamagedCasesCount, OverheatedCount, MixRatioOutOfSpecCount, ImpurityCount }) => ({ DamagedUnitCount, DamagedCasesCount, OverheatedCount, MixRatioOutOfSpecCount, ImpurityCount }))(goodsData.currentValues),
                    MixRatio: { "Target Mix": goodsData.currentValues.TargetMix, "Hopper Mix": goodsData.currentValues.Setpoint, "Finished Goods Mix": goodsData.currentValues.ActualMix }
                    ,
                    graphData: {
                        labels: ['Total Complete Cases', ' Defect Cases'],
                        datasets: [{
                            label: "",
                            backgroundColor: ['#1F8EFA', '#C31FFA'],
                            borderColor: 'rgb(255, 99, 132)',
                            data: [goodsData.currentValues.CasesComplete, goodsData.currentValues.DefectCases],
                        }]
                    }
                })
            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, Alert summary data')
            });
    }
    // tableSummaryData = () => {
    //     fetch('https://3e0n7ol0r9.execute-api.us-east-1.amazonaws.com/default ')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             this.setState({
    //                 tableAlerts: data.Alerts,
    //                 tableWarnings: data.Warnings,
    //             })
    //         })
    //         .catch(function (err) {
    //             console.log(err, 'Something went wrong, Alert summary data')
    //         });
    // }
    //Alert Table Data
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

    triggerFinishedGoodsTableData = () => {
        tableAlerts = 0;
        tableWarnings = 0;
        //lineAssetData = data;
        initialTableData = alarmsData;
        alarmsData = [];
        tableWarnings = 0;
        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN004')
            .then((response) => response.json())
            .then((data) => {
                var alarmsData = [];
                for (let i = 0; i < data.alarms.length; i++) {
                    data.alarms[i].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.alarms[i].START_TIME));
                    data.alarms[i].Line = sessionStorage.lineName;
                    data.alarms[i].START_TIME = this.epochToDate(data.alarms[i].START_TIME);
                    if (data.alarms[i].SEVERITY == "Alert") {
                        data.alarms[i][""] = <img src={alert} />;
                        tableAlerts++;
                    } else {
                        data.alarms[i][""] = <img src={warning} />;
                        tableWarnings++;
                    }
                    alarmsData.push(data.alarms[i]);
                }
                if (initialTableData.length < alarmsData.length) {
                    var diffenceCount = alarmsData.length - initialTableData.length;
                    var initialLength = alarmsData.length;
                    for (let z = 0; z < diffenceCount; z++) {
                        this.notify(alarmsData[initialLength - z - 1].SEVERITY, alarmsData[initialLength - z - 1].Line, alarmsData[initialLength - z - 1].ASSET)
                    }
                }
                this.setState({
                    tableData: alarmsData,
                })
                console.log(this.state.tableData, "blenderalarms");
            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, finished goods table data')
            });
    }
    // setAutoRefresh = () => {
    //     clearInterval(this.apiTimerReferenceonload);
    //     this.setState((prevState) => {
    //         const { autoRefreshState } = prevState;
    //         sessionStorage.autoRefreshState = autoRefreshState ? "false" : "true";

    //         return {
    //             autoRefreshState: !autoRefreshState,
    //             buttonLabel: !autoRefreshState ? 'STOP REFRESH' : "START REFRESH",
    //             autoRefreshStatus: !autoRefreshState ? 'auto-refresh' : "",
    //         }
    //     }, () => {
    //         if (this.state.autoRefreshState) {
    //             this.apiTimerReference = setInterval(() => {
    //                 this.triggerFinishedGoodsTableData();
    //                 this.finishedGoodsViewData();
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
autoClose : false
            });
        } else if (status.toLowerCase() == "alert") {
            toast.error(alertMessage, {
                position: toast.POSITION.TOP_RIGHT,
autoClose : false
            });
        }

    };
    componentDidMount() {
        // const responseHeader = {
        //   headers: {
        //     'X-API-KEY': 'k1AHdHjUI45HGsWfQasE28qqWT4nRflZ4q2rqNTw'
        //   }
        // };
        this.triggerFinishedGoodsTableData();
        // this.tableSummaryData();
        this.finishedGoodsViewData();
        // if (sessionStorage.autoRefreshState === "true") {
            this.apiTimerReferenceonload = setInterval(() => {
                this.triggerFinishedGoodsTableData();
                this.finishedGoodsViewData();
            }, 2000);
        //     this.setState(() => {
        //         return {
        //             autoRefreshState: true,
        //             buttonLabel: 'STOP REFRESH',
        //             autoRefreshStatus: 'auto-refresh',
        //         }
        //     });
        // }
    }
    componentWillUnmount() {
        tableAlerts = 0;
        tableWarnings = 0;
        clearInterval(this.apiTimerReference);
        clearInterval(this.apiTimerReferenceonload);
    }

    render() {
        const graphOptions = {
            legend: {
                display: false
            },
            aspectRatio: 1,
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: "white",

                    },
                    barThickness: 150,
                    gridLines: {
                        offsetGridLines: true,

                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        fontColor: "white",
                        min: 0,
                        max: 1000,
                        stepSize: 100
                    },

                }]
            },
        }
        return (

            <div>
                <div className="tkey-header">
                    <BackButton />
                    <Breadcrumb pages={this.state.pages} />
                    <div className="page-dropdown-heading">Asset</div>
                    <Dropdown
                        options={this.state.dropdownOptions}
                        setDropdownSelectedValue={this.setDropdownSelectedValue}
                        dropdownselectedValue={this.state.dropdownSelectedValue}
                    />
                </div>
                <div className="data-container finished-view">
                    <div className="finished-graph-container">
                        <div className="mix-ratio-container card-tile">
                            <div className="finished-goods-rate-heading">
                                Mix Ratio
                            </div>
                            {Object.keys(this.state.MixRatio).length > 0 && Object.keys(this.state.MixRatio).map(key =>
                                <FinishedMixRatio data={this.state.MixRatio[key]} name={key} />
                            )
                            }
                        </div>
                        <div className="goods-data-container card-tile">
                            <div className="finished-goods-rate-heading">
                                Defect Analysis
                            </div>
                            {Object.keys(this.state.DefectAnalysis).length > 0 && <DefectAnalysis data={Object.entries(this.state.DefectAnalysis)} />}
                        </div>
                        <div className="cases-graph card-tile">
                            <div className="finished-goods-rate-heading">
                                Cases
                            </div>
                            <Bar data={this.state.graphData} options={graphOptions} />
                        </div>
                    </div>

                    <div className="table-details-container card-tile">
                        <DataTableComponent filteredData={this.state.tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />
                        {/* <button className={"refresh-button " + this.state.autoRefreshStatus} onClick={this.setAutoRefresh}>{this.state.buttonLabel}</button> */}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        );
    }
}
export default withRouter(FinishedGoodsView);