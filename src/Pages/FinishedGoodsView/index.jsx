import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Dropdown from '../../Component/Dropdown';
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
import Table from '../../Component/Table';
import alert from '../../Images/alert.png';
import { Bar } from 'react-chartjs-2';
import warning from '../../Images/warning.png';
import FinishedMixRatio from '../../Component/FinishedMixRatio';
import './index.css';
import DefectAnalysis from '../../Component/DefectAnalysis';
var tableAlerts =0;
var tableWarnings = 0;
class FinishedGoodsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ['Plant View', this.props.location.state.lineValue, 'Finished Goods View'],
            dropdownSelectedValue: 'Finished Goods View',
            selectedLine: 'Line_3',
            dropdownOptions: ['Bin', 'Hopper', 'Blender', 'Finished Goods View'],
            
            tableData: [{}],
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
            FinishedGoodsMix: {}
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
                    MixRatio:{"TargetMix":(({ TargetMixRatioBlue, TargetMixRatioGreen }) => ({ TargetMixRatioBlue, TargetMixRatioGreen }))(goodsData.currentValues),"HopperMix":(({ HopperMixRatioBlue, HopperMixRatioGreen }) => ({ HopperMixRatioBlue, HopperMixRatioGreen }))(goodsData.currentValues),"FinishedGoodsMix":(({ FinishedGoodsMixRatioBlue, FinishedGoodsMixRatioGreen }) => ({ FinishedGoodsMixRatioBlue, FinishedGoodsMixRatioGreen }))(goodsData.currentValues)}
                    ,
                    graphData: {
                        labels: ['TotalCases',' Defect Cases'],
                        datasets: [{
                            label: "",
                            backgroundColor: ['#1F8EFA', '#C31FFA'],
                            borderColor: 'rgb(255, 99, 132)',
                            data: [goodsData.currentValues.TotalCases, goodsData.currentValues.DefectCases],
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
    triggerFinishedGoodsTableData = () => {
        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN004')
          .then((response) => response.json())
          .then((data) => {
              var alarmsData =[];
            for (let i = 0; i < data.alarms.length; i++) {
              data.alarms[i].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.alarms[i].START_TIME));
              data.alarms[i].Line = data.alarms[i].ASSET;
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
            this.setState({
                tableData : alarmsData,
            })
            console.log(this.state.tableData, "blenderalarms");
          })
          .catch(function (err) {
            console.log(err, 'Something went wrong, finished goods table data')
          });
      }
    componentDidMount() {
        // const responseHeader = {
        //   headers: {
        //     'X-API-KEY': 'k1AHdHjUI45HGsWfQasE28qqWT4nRflZ4q2rqNTw'
        //   }
        // };
        this.triggerFinishedGoodsTableData();
        // this.tableSummaryData();
        this.finishedGoodsViewData();
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
                        offsetGridLines: true
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        fontColor: "white",
                    },

                }]
            },
        }
        return (

            <div className="data-container">
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
                <div className="finished-goods-container">
                    <div className="finished-goods-container-heading">Finished Goods View</div>
                    <div className="finished-graph-container">
                        <div className="mix-ratio-container">
                            <div className="finished-goods-rate-heading">
                                Mix Ratio
                            </div>
                            {Object.keys(this.state.MixRatio).length > 0 && Object.keys(this.state.MixRatio).map(key =>
                                <FinishedMixRatio data={this.state.MixRatio[key]} name={key} />
                            )
                            }
                        </div>
                        <div className="goods-data-container">
                            <div className="finished-goods-rate-heading">
                                Defect Analysis
                            </div>
                            {Object.keys(this.state.DefectAnalysis).length > 0 && <DefectAnalysis data={Object.entries(this.state.DefectAnalysis)} />}
                        </div>
                        <div className="cases-graph">
                            <div className="finished-goods-rate-heading">
                                Cases
                            </div>
                            <Bar data={this.state.graphData} options={graphOptions} />
                        </div>
                    </div>
                </div>
                <div className="table-details-container">
                    <div className="table-summary"><span >Active</span><span ><img src={alert} /> Alerts {tableAlerts}</span> and <span><img src={warning} /> Warnings {tableWarnings}</span></div>
                    <div className="table-date">{this.state.tableData.length > 0 && <Table data={this.state.tableData} />} </div>
                </div>
            </div>
        );
    }
}
export default withRouter(FinishedGoodsView);