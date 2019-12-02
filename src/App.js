import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import BinView from './Pages/BinView/index';
import HopperView from './Pages/HopperView/index';
import AlertView from './Pages/Alerts/index';
import ControlTowerView from './Pages/ControlTower/index';
import PlantView from './Pages/PlantView/index';
import Menu from './Component/Menu';
import AnalyticsView from './Pages/Analytics/index';
import BlenderView from './Pages/BlenderView/index';
import FinishedGoodsView from './Pages/FinishedGoodsView/index';
import LineView from './Pages/LineView/index';
import LaborCorrelation from './Pages/LaborCorrelation';
import SetPointOptimization from './Pages/SetPointOptimization';
import PredictiveMaintenace from './Pages/PredictiveMaintenace';
import RateOptimization from './Pages/RateOptimization';
import RawMaterialInsights from './Pages/RawMaterialInsights';
import './index.css';
import './SCSS/main.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from './Component/Button';
import ToastNotification from './Component/ToastNotification';
var tableAlerts = 0;
var tableWarnings = 0;
var initialTableData = [];
var alarmsData = [];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
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
  triggerPlantAlertData = () => {
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN099')
      .then((response) => response.json())
      .then((data) => {
        tableAlerts = 0;
        tableWarnings = 0;
        initialTableData = alarmsData;
        alarmsData = [];
        var lineDropdownValue = [];
        for (let i = 0; i < data.alarms.length; i++) {
          data.alarms[i].Line = "Plant Level";
          alarmsData.push(data.alarms[i]);
          if (data.alarms[i].SEVERITY.toLowerCase() == "alert") {
            tableAlerts++;
          } else if (data.alarms[i].SEVERITY.toLowerCase() == "warning") {
            tableWarnings++;
          }
        }
        for (let i = 0; i < data.children.length; i++) {
          for (let j = 0; j < data.children[i].alarms.length; j++) {
            data.children[i].alarms[j].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.children[i].alarms[j].START_TIME));
            data.children[i].alarms[j].Line = data.children[i].ASSET_NAME;
            data.children[i].alarms[j].START_TIME = this.epochToDate(data.children[i].alarms[j].START_TIME);
            if (data.children[i].alarms[j].SEVERITY == "Alert") {
              data.children[i].alarms[j]["statusBox"] = "";
              tableAlerts++;
            } else {
              data.children[i].alarms[j]["statusBox"] = "";
              tableWarnings++;
            }
            alarmsData.push(data.children[i].alarms[j]);
          }
          for (let k = 0; data.children[i].children != undefined && k < data.children[i].children.length; k++) {
            for (let z = 0; z < data.children[i].children[k].alarms.length; z++) {
              if (data.children[i].children[k].alarms.length > 0) {
                data.children[i].children[k].alarms[z].Line = data.children[i].ASSET_NAME;
              }
              data.children[i].children[k].alarms[z].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.children[i].children[k].alarms[z].START_TIME));
              data.children[i].children[k].alarms[z].START_TIME = this.epochToDate(data.children[i].children[k].alarms[z].START_TIME);
              if (data.children[i].children[k].alarms[z].SEVERITY == "Alert") {
                data.children[i].children[k].alarms[z]["statusBox"] = "";
                tableAlerts++;
              } else {
                data.children[i].children[k].alarms[z]["statusBox"] = "";
                tableWarnings++;
              }

              alarmsData.push(data.children[i].children[k].alarms[z]);
            }
          }
          if (tableAlerts == 0 && tableWarnings == 0) {
            data.children[i]["backGroundColor"] = "green";
          } else if (tableAlerts > 0) {
            data.children[i]["backGroundColor"] = "red";
          } else if (tableAlerts == 0 && tableWarnings > 0) {
            data.children[i]["backGroundColor"] = "orange";
          }
          if (initialTableData.length < alarmsData.length && this.state.counter > 0) {
            // var diffenceCount = alarmsData.length - initialTableData.length;
            // for (let z = 0; z < diffenceCount; z++) {
            //   this.notify(alarmsData[z].SEVERITY, alarmsData[z].Line, alarmsData[z].ASSET, alarmsData[z].DESCRIPTION,alarmsData[z].STATUS,alarmsData[z].Duration)
            // }
            for (let j = 0; j < alarmsData.length; j++) {
              var alarmsCount = 0;
              for (let k = 0; k < initialTableData.length; k++) {
                if (alarmsData[j].ASSET == initialTableData[k].ASSET && alarmsData[j].ASSET_TYPE == initialTableData[k].ASSET_TYPE && alarmsData[j].DESCRIPTION == initialTableData[k].DESCRIPTION && alarmsData[j].START_TIME == initialTableData[k].START_TIME) {
                  alarmsCount++;
                }
              }
              if (alarmsCount == 0) {
                this.notify(alarmsData[j].SEVERITY, alarmsData[j].Line, alarmsData[j].ASSET, alarmsData[j].DESCRIPTION, alarmsData[j].STATUS, alarmsData[j].START_TIME);
              }
            }
          }
        }

        for (let i = 0; i < data.children.length; i++) {
          lineDropdownValue.push(data.children[i].GUID);
        }
        this.setState({
          counter: 1

        });
      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, Alert table data')
      });

  }
  notify = (status, line, asset, description, alarmStatus, duration) => {
    if (status.toLowerCase() == "warning") {
      toast.warn(<ToastNotification status={status} line={line} description={description} alarmStatus={alarmStatus} duration={duration} />, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false,
        className: 'warning-background',
        bodyClassName: "grow-font-size",
        progressClassName: 'fancy-progress-bar'
      });
    } else if (status.toLowerCase() == "alert") {
      toast.error(<ToastNotification status={status} line={line} description={description} alarmStatus={alarmStatus} duration={duration} />, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false
      });
    }

  };
  componentDidMount() {
    this.triggerPlantAlertData();
    this.apiTimerReferenceonload = setInterval(() => {
      this.triggerPlantAlertData();
    }, 2000);
  }
  componentWillUnmount() {
    clearInterval(this.apiTimerReference);
    clearInterval(this.apiTimerReferenceonload);
    tableAlerts = 0;
    tableWarnings = 0;
  }


  render() {
    return (
      <Router>
        <Menu />

        <div>
          <Route path="/binView" exact component={BinView} />
          <Route path="/hopperView" exact component={HopperView} />
          <Route path="/blenderView" exact component={BlenderView} />
          <Route path="/alerts" exact component={AlertView} />
          <Route path="/controlTower" exact component={ControlTowerView} />
          <Route path="/" exact component={PlantView} />
          <Route path="/lineView" exact component={LineView} />
          <Route path="/analytics" exact component={AnalyticsView} />
          <Route path="/finishedGoodsView" exact component={FinishedGoodsView} />
          <Route path="/laborCorrelation" exact component={LaborCorrelation} />
          <Route path="/setpointOptimization" exact component={SetPointOptimization} />
          <Route path="/predictiveMaintenace" exact component={PredictiveMaintenace} />
          <Route path="/rateOptimization" exact component={RateOptimization} />
          <Route path="/rawMaterial" exact component={RawMaterialInsights} />
          <ToastContainer closeButton={<Button labelName={"OK"} />} />
        </div>
      </Router>
    )
  }
}

export default App;