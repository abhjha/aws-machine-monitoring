import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Dropdown from '../../Component/Dropdown';
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb'
import { Bar } from 'react-chartjs-2';
import Time from '../../Component/Time';
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import alert from '../../Images/alert.png';
import warning from '../../Images/warning.png';
import 'chartjs-plugin-annotation';
var tableWarnings = 0;
var tableAlerts = 0;
var tableData = [];
class BinView extends Component {
  constructor(props) {
    super(props);
    console.log(props, "props");
    this.state = {
      pages: ['Plant View', sessionStorage.lineName, 'Bin'],
      dropdownSelectedValue: 'Bin',
      blueLeftData: [{}],
      greenLeftData: [{}],
      BBConsumptioRate: 0,
      GBConsumptioRate: 0,
      selectedLine: 'Line_3',
      minimumTarget: 0,
      refillPoint: 0,
      alarmsData : [],
      BlueBinGraphData: {
        datasets: [{
          label: "",
          backgroundColor: '#FFAB4F',
          borderColor: 'rgb(255, 99, 132)',
          data: [],
        }]
      },
      GreenBinGraphData: {
        datasets: [{
          label: "",
          backgroundColor: '#05C985',
          borderColor: 'rgb(255, 99, 132)',
          data: [0],
        }]
      },
      dropdownOptions: ['Bin', 'Hopper', 'Blender'],
      buttonLabel: 'START REFRESH',
      autoRefreshStatus: '',
      autoRefreshState: sessionStorage.autoRefreshState === "true" ? true : false,
    }
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

  setDropdownSelectedValue = (e) => {
    const dropdownSelectedValue = e.currentTarget.getAttribute('data-value');
    //this.setState({ dropdownSelectedValue });
    if (dropdownSelectedValue === 'Hopper') {
      this.props.history.push({
        pathname: '/hopperView',
        state: { lineValue: this.props.location.state.lineValue },
      });
    } else if (dropdownSelectedValue === 'Blender') {
      this.props.history.push({
        pathname: '/blenderView',
        state: { lineValue: this.props.location.state.lineValue },
      });
    } else if (dropdownSelectedValue === 'Finished Goods View') {
      this.props.history.push({
        pathname: '/finishedGoodsView',
        state: { lineValue: this.props.location.state.lineValue },
      });
    }
  }
  triggerBlueBinViewData = () => {
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=SN005&lengthOfHistory=5')
      .then((response) => response.json())
      .then((binData) => {
        console.log(binData, "blue");
        var bgColor = "";
        if (binData.currentValues.binLevel > binData.currentValues.refillPoint) {
          bgColor = "#05C985";
        } else if (binData.currentValues.binLevel <= binData.currentValues.refillPoint && binData.currentValues.binLevel >= binData.currentValues.minimumTarget) {
          bgColor = 'orange';
        } else {
          bgColor = '#EE423D';
        }
        this.setState({
          blueLeftData: [{ value: binData.currentValues.timeToRefill, binName: 'Blue Bin' }],
          BlueBinGraphData: {
            datasets: [{
              label: "",
              backgroundColor: bgColor,
              borderColor: 'rgb(255, 99, 132)',
              data: [binData.currentValues.binLevel]
            }]
          },
          BBConsumptioRate: binData.currentValues.consumptionRate,
          minimumTarget: binData.currentValues.minimumTarget,
          refillPoint: binData.currentValues.refillPoint
        })
      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, Column1 data')
      });
  }
  triggerGreenBinViewData = () => {
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=SN006&lengthOfHistory=5')
      .then((response) => response.json())
      .then((binData) => {
        console.log(binData, "green");
        var bgColor = "";
        if (binData.currentValues.binLevel > binData.currentValues.refillPoint) {
          bgColor = "#05C985";
        } else if (binData.currentValues.binLevel < binData.currentValues.refillPoint && binData.currentValues.binLevel > binData.currentValues.minimumTarget) {
          bgColor = 'yellow';
        } else {

          bgColor = '#EE423D';
        }
        this.setState({
          greenLeftData: [{ value: binData.currentValues.timeToRefill, binName: 'Green Bin' }],
          GreenBinGraphData: {
            datasets: [{
              label: "Volume(litres)",
              backgroundColor: bgColor,
              borderColor: 'rgb(255, 99, 132)',
              data: [binData.currentValues.binLevel]
            }]
          },
          GBConsumptioRate: binData.currentValues.consumptionRate,
          minimumTarget: binData.currentValues.minimumTarget,
          refillPoint: binData.currentValues.refillPoint
        })
      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, Column1 data')
      });
  }
  //Alert table data
  triggerGreenBinTableData = () => {
    //tableData = [];
    let interimTableData = [];
    let interimTableAlerts = 0;
    let interimTableWarning = 0;
    //tableAlerts = 0;
    //tableWarnings = 0;
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN006')
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.alarms.length; i++) {
          data.alarms[i].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.alarms[i].START_TIME));
          data.alarms[i].Line = sessionStorage.lineName;
          data.alarms[i].START_TIME = this.epochToDate(data.alarms[i].START_TIME);
          if (data.alarms[i].SEVERITY == "Alert") {
            data.alarms[i][""] = <img src={alert} />;
            interimTableAlerts++;
          } else {
            data.alarms[i][""] = <img src={warning} />;
            interimTableWarning++;
          }
          interimTableData.push(data.alarms[i]);
        }
        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN005')
          .then((response) => response.json())
          .then((data) => {
            console.log(data , "blue table checing data");
            tableData = [];
            tableData = [...interimTableData];
            interimTableData= [];
            tableAlerts = interimTableAlerts;
            tableWarnings = interimTableWarning;
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
             
              tableData.push(data.alarms[i]);
              console.log(tableData, 'tabledata again')
            }
            this.setState({
              alarmsData : tableData
            })
          })
          .catch(function (err) {
            console.log(err, 'Something went wrong, blue bin table data')
          });
        
      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, green bin table data')
      });
      
    console.log(tableData, "bin table data");
      
  }
  // triggerBlueBinTableData = () => {
  //   tableData = [];
    
  //   console.log(tableData, "bin table data");
  // }
  // setAutoRefresh = () => {
  //   clearInterval(this.apiTimerReferenceonload);
  //   this.setState((prevState) => {
  //     const { autoRefreshState } = prevState;
  //     sessionStorage.autoRefreshState = autoRefreshState ? "false" : "true";

  //     return {
  //       autoRefreshState: !autoRefreshState,
  //       buttonLabel: !autoRefreshState ? 'STOP REFRESH' : "START REFRESH",
  //       autoRefreshStatus: !autoRefreshState ? 'auto-refresh' : "",
  //     }
  //   }, () => {
  //     if (this.state.autoRefreshState) {
  //       this.apiTimerReference = setInterval(() => {
  //         this.triggerBlueBinTableData();
  //         this.triggerGreenBinTableData();
  //         this.triggerBlueBinViewData();
  //         this.triggerGreenBinViewData();
  //       }, 2000);
  //     } else {
  //       clearInterval(this.apiTimerReference);
  //     }
  //   });

  // }
  componentDidMount() {
    // const responseHeader = {
    //   headers: {
    //     'X-API-KEY': 'k1AHdHjUI45HGsWfQasE28qqWT4nRflZ4q2rqNTw'
    //   }
    // };

    // this.triggerBlueBinTableData();
    this.triggerGreenBinTableData();
    this.triggerBlueBinViewData();
    this.triggerGreenBinViewData();
    // if (sessionStorage.autoRefreshState === "true") {
      this.apiTimerReferenceonload = setInterval(() => {
        // this.triggerBlueBinTableData();
        this.triggerGreenBinTableData();
        this.triggerBlueBinViewData();
        this.triggerGreenBinViewData();
      }, 2000);
    //   this.setState(() => {
    //     return {
    //       autoRefreshState: true,
    //       buttonLabel: 'STOP REFRESH',
    //       autoRefreshStatus: 'auto-refresh',
    //     }
    //   });
    // }

  }
  componentWillUnmount() {
    clearInterval(this.apiTimerReference);
    clearInterval(this.apiTimerReferenceonload);
    tableAlerts = 0;
    tableWarnings = 0;
    tableData = [];
  }

  render() {
    console.log(tableData, "bin data");
    const graphOptions = {
      legend: {
        display: false
      },
      aspectRatio: 1,
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: this.state.minimumTarget,
          borderColor: 'white',
          borderWidth: 2,
          borderDash: [3, 3],

          label: {
            content: "Minimum Target",
            enabled: true,
            position: "top",
            xAdjust: 217,
            yAdjust: 20,
            backgroundColor: 'transparent',
            endValue: 60,
          }
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: this.state.refillPoint,
          borderColor: 'white',
          borderWidth: 2,
          borderDash: [3, 3],
          label: {
            content: "Refill Point",
            enabled: true,
            position: "top",
            xAdjust: 217,
            yAdjust: 20,
            backgroundColor: 'transparent',

          }
        }
        ],
        drawTime: "afterDraw",
      },
      scales: {
        xAxes: [{
          barThickness: 150,
          gridLines: {
            offsetGridLines: true
          },
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Weight (g)",
            fontSize: 16,
            fontColor: 'white',
          },
        }],
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 300,
            fontColor: 'white',
            stepSize: 30
          },

        }]
      },
    };
    var values = (
      <div>
        {this.state.blueLeftData.length > 0 && this.state.blueLeftData.map((item, index) => {
          return <Time
            value={item.value}
            binName={item.binName}
            key={index}
          />
        }
        )}
      </div>
    )
    var greenValues = (
      <div>
        {this.state.greenLeftData.length > 0 && this.state.greenLeftData.map((item, index) => {
          return <Time
            value={item.value}
            binName={item.binName}
            key={index}
          />
        }
        )}
      </div>
    )
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

        <div className="data-container bin-view-page">
          <div className="bin-graph-container">
            <div className="refill-container card-tile">
              <div className="bin-view">
                <p className="bin-view-heading">Time Left to Refill</p>
                {greenValues} {values}
              </div>
            </div>
            <div className="bin1-graph card-tile">
              <div className="graph-heading">
                Green Bin Level
                </div>
              <Bar data={this.state.GreenBinGraphData} options={graphOptions}
              />
              <div className="consumption-rate">
                <span className="consumption-rate-heading"> Consumption Rate</span><span className="consumption-rate-value"> {this.state.GBConsumptioRate.toFixed(2) + " Balls per Minute"}</span>
              </div>
            </div>
            <div className="bin2-graph card-tile">
              <div className="graph-heading">
                Blue Bin Level
                </div>
              <Bar data={this.state.BlueBinGraphData} options={graphOptions}
              />
              <div className="consumption-rate">
                <span className="consumption-rate-heading"> Consumption Rate</span><span className="consumption-rate-value"> {this.state.BBConsumptioRate.toFixed(2) + " Balls per Minute"}</span>
              </div>
            </div>
          </div>
          <div className="table-details-container card-tile">
            {<DataTableComponent filteredData={this.state.alarmsData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />}
            {/* <button className={"refresh-button " + this.state.autoRefreshStatus} onClick={this.setAutoRefresh}>{this.state.buttonLabel}</button> */}
          </div>
        </div>
      </div>
    );

  }
}

export default withRouter(BinView);