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
    console.log(props , "props");
    this.state = {
      pages: ['Plant View', 'Paint Shop', 'Raw Material Bins'],
      dropdownSelectedValue: 'Raw Material Bins',
      blueLeftData :[{}],
      greenLeftData :[{}],
      BBConsumptioRate: 0,
      GBConsumptioRate: 0,
      selectedLine: 'Line_3',
      minimumTarget : 0,
      refillPoint : 0,
      
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
      dropdownOptions: ['Raw Material Bins', 'Mixing Unit', 'Paint Machine'],
    }
  }
  millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + " m " + (seconds < 10 ? '0' : '') + seconds + "s";
}
epochToDate = (dateVal) => {
    var date = new Date(parseFloat(dateVal.substr(6)));
    return(
        (date.getMonth() + 1) + "/" +
        date.getDate() + "/" +
        date.getFullYear() + " " +
        date.getHours() + ":" +
        date.getMinutes() + ":" +
        date.getSeconds()
    );
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
        console.log(binData , "blue");
        var bgColor = "";
        if(binData.currentValues.binLevel > binData.currentValues.refillPoint){
          bgColor = "#05C985";
        } else if(binData.currentValues.binLevel < binData.currentValues.refillPoint && binData.currentValues.binLevel > binData.currentValues.minimumTarget){
          bgColor = 'orange';
        } else{
          bgColor = '#EE423D';
        }
        this.setState({ 
          blueLeftData: [{ value: binData.currentValues.timeToRefill, binName: 'Dye Bin' }],
          BlueBinGraphData: {
            datasets: [{
              label: "",
              backgroundColor: bgColor,
              borderColor: 'rgb(255, 99, 132)',
              data: [binData.currentValues.binLevel]
            }]
          },
          BBConsumptioRate : binData.currentValues.consumptionRate,
          minimumTarget :binData.currentValues.minimumTarget ,
          refillPoint : binData.currentValues.refillPoint
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
        if(binData.currentValues.binLevel > binData.currentValues.refillPoint){
          bgColor = "#05C985";
        } else if(binData.currentValues.binLevel < binData.currentValues.refillPoint && binData.currentValues.binLevel > binData.currentValues.minimumTarget){
          bgColor = 'yellow';
        } else{
          
          bgColor = '#EE423D';
        }
        this.setState({ 
          greenLeftData: [{ value: binData.currentValues.timeToRefill, binName: 'Sealant Bin' }],
          GreenBinGraphData: {
            datasets: [{
              label: "",
              backgroundColor: bgColor,
              borderColor: 'rgb(255, 99, 132)',
              data: [binData.currentValues.binLevel]
            }]
          },
          GBConsumptioRate : binData.currentValues.consumptionRate,
          minimumTarget :binData.currentValues.minimumTarget ,
          refillPoint : binData.currentValues.refillPoint
        })
      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, Column1 data')
      });
  }
  //Alert table data
  triggerGreenBinTableData = () => {
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN006')
      .then((response) => response.json())
      .then((data) => {
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
          tableData.push(data.alarms[i]);
        }

      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, green bin table data')
      });
      console.log(tableData , "bin table data");
  }
  triggerBlueBinTableData = () => {
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN005')
      .then((response) => response.json())
      .then((data) => {
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
          tableData.push(data.alarms[i]);
        }
        console.log(tableData, "asdfdsjfhgduifhkjsdlkasjdla");
      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, blue bin table data')
      });
      console.log(tableData , "bin table data");
  }
  
  componentDidMount() {
    // const responseHeader = {
    //   headers: {
    //     'X-API-KEY': 'k1AHdHjUI45HGsWfQasE28qqWT4nRflZ4q2rqNTw'
    //   }
    // };

    this.triggerBlueBinTableData();
    this.triggerGreenBinTableData();
    this.triggerBlueBinViewData();
    this.triggerGreenBinViewData();

  }

  render() {
    console.log(tableData , "bin data");
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
          borderColor: 'black',
          borderWidth: 2,
          borderDash: [3, 3],
          label: {
            content: "Minimum Target",
            enabled: true,
            position: "bottom",
            xAdjust: 217,
            yAdjust: 20,
            backgroundColor: 'black'
          }
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: this.state.refillPoint,
          borderColor: 'black',
          borderWidth: 2,
          borderDash: [3, 3],
          label: {
            content: "Refill Point",
            enabled: true,
            position: "bottom",
            xAdjust: 217,
            yAdjust: 20,
            backgroundColor: 'black',

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
          }
        }],
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true,
          },

        }]
      },
    };
    var values = (
      <div>
        {this.state.blueLeftData.length>0 && this.state.blueLeftData.map((item, index) => {
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
        {this.state.greenLeftData.length>0 && this.state.greenLeftData.map((item, index) => {
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
      <div className="data-container bin-view-page">
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
        <div className="bin-container-heading">
          Raw Material Bins
            </div>
        <div className="bin-container">
          
          <div className="bin-graph-container">
            <div className="refill-container card-tile">
              <div className="bin-view">
                <p className="bin-view-heading">Time Left to Refill</p>
                {values} {greenValues}
              </div>
            </div>
            <div className="bin1-graph card-tile">
              <div className="graph-heading">
              Sealant Bin Level
                </div>
              <Bar data={this.state.GreenBinGraphData} options={graphOptions}
              />
              <div className="consumption-rate">
                <span className="consumption-rate-heading"> Consumption Rate</span><span className="consumption-rate-value"> {this.state.GBConsumptioRate + " liters per minute"}</span>
              </div>
            </div>
            <div className="bin2-graph card-tile">
              <div className="graph-heading">
              Dye Bin Level
                </div>
              <Bar data={this.state.BlueBinGraphData} options={graphOptions}
              />
              <div className="consumption-rate">
                <span className="consumption-rate-heading"> Consumption Rate</span><span className="consumption-rate-value"> {this.state.BBConsumptioRate+ " liters per minute"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="table-details-container card-tile">
       {((tableWarnings > 0 || tableAlerts > 0) ) && <DataTableComponent filteredData={tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />}
        </div>
      </div>
    );

  }
}

export default withRouter(BinView);