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
var tableAlerts = 0;
var tableWarnings = 0;
var tableAlertsDifference = 0;
var tableWarningDifference = 0;

class App extends React.Component {
  constructor(props) {
    //sessionStorage.autoRefreshState = "false";
    super(props);
    this.state = {
        
        autoRefreshState: sessionStorage.autoRefreshState === "true" ? true : false,
        flag: true,
        
        refershCount: 0,
        buttonLabel: 'START REFRESH',
        autoRefreshStatus: ''
    }
}
  triggerPlantAlertData = () => {
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN099')
        .then((response) => response.json())
        .then((data) => {
            tableAlertsDifference = tableAlerts;
            tableWarningDifference = tableWarnings;
            tableAlerts = 0;
            tableWarnings = 0;
            var alarmsData = [];
            var lineDropdownValue = [];
            for (let i = 0; i < data.alarms.length; i++) {
                data.alarms[i].Line = "";
                alarmsData.push(data.alarms[i]);
                if(data.alarms[i].SEVERITY.toLowerCase() == "alert"){
                    tableAlerts++;
                }else if(data.alarms[i].SEVERITY.toLowerCase() == "warning"){
                    tableWarnings++;
                }
            }
            for (let i = 0; i < data.children.length; i++) {
                for (let j = 0; j < data.children[i].alarms.length; j++) {
                   
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
                        if (data.children[i].alarms.length > 0) {
                            data.children[i].children[k].alarms[z].Line = data.children[i].ASSET_NAME;
                        } else {
                            data.children[i].children[k].alarms[z].Line = "";
                        }
                        
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
                if(tableAlerts == 0 && tableWarnings == 0){
                    data.children[i]["backGroundColor"] = "green";
                }else if(tableAlerts>0){
                    data.children[i]["backGroundColor"] = "red";
                }else if(tableAlerts ==0 && tableWarnings>0){
                    data.children[i]["backGroundColor"] = "orange";
                }
                if(tableWarnings>tableWarningDifference){
                    for(let z=0; z<tableWarnings-tableWarningDifference;z++ ){
                        this.notify("warning");
                    }
                }
                if(tableAlerts > tableAlertsDifference){
                    for(let z=0; z<tableAlerts-tableAlertsDifference;z++ ){
                        this.notify("alert");
                    }
                }

            }

            for (let i = 0; i < data.children.length; i++) {
                lineDropdownValue.push(data.children[i].GUID);
            }
            this.setState({
                tableData: alarmsData,
                plantAssetData: data,
                lineDropDown: lineDropdownValue,

            });

        })
        .catch(function (err) {
            console.log(err, 'Something went wrong, Alert table data')
        });
}
notify = (status) => {
  if(status == "warning"){
      toast.warn("New warning !", {
          position: toast.POSITION.TOP_RIGHT
        });
  }else if(status == "alert"){
      toast.error("New alert !", {
          position: toast.POSITION.TOP_RIGHT
        });
  }

};


componentDidMount() {
  this.triggerPlantAlertData();
  if (sessionStorage.autoRefreshState === "true") {
      this.apiTimerReferenceonload = setInterval(() => {
          this.triggerPlantAlertData();
      }, 2000);
      this.setState(() => {
          return {
              autoRefreshState: true,
              buttonLabel: 'STOP REFRESH',
              autoRefreshStatus: 'auto-refresh',
          }
      });
  }
}

componentWillUnmount() {
  clearInterval(this.apiTimerReference);
  clearInterval(this.apiTimerReferenceonload);
  tableAlerts = 0;
  tableWarnings = 0;
  //sessionStorage.autoRefreshState = false;
}

  render (){
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
          <ToastContainer/>
        </div>
      </Router>
    )
  }
}

export default App;