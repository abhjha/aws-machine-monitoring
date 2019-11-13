import React from 'react';
import LabelCard from '../../Component/LabelCard';
import ScheduleAdherence from '../../Component/ScheduleAdherence';
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import alert from '../../Images/alert.png';
import warning from '../../Images/warning.png';
import LineView from '../../Pages/LineView';
import PlantAsset from '../../Component/PlantViewContainer';
var tableAlerts=0;
var tableWarnings =0;

class PlantView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plantData: {},
            tableData: [],
            plantAssetData :{},
            lineDropDown : [],
            autoRefreshState : false,
            flag : true,
            filteredData : [],
            refershCount : 0,
            buttonLabel: 'START REFRESH'
        }
    }
    
    triggerPlantViewData = () => {
        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=SN099&lengthOfHistory=5')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    plantData: data.currentValues,
                })
            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, Plant View data')
            });
    }
    
    navigateAsset = (e)=>{
        const lineID = e.currentTarget.getAttribute('data-id');
        this.props.history.push({ 
            pathname: '/lineView', 
            Component: { LineView },
            state : {lineID ,lineDropDown: this.state.lineDropDown}
        });
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

    triggerPlantAlertData = () => {
        console.log("hi");
        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN099')
            .then((response) => response.json())
            .then((data) => {
                tableAlerts =0;
                tableWarnings = 0;
                var alarmsData = [];
                var lineDropdownValue =[];
                for (let i = 0; i < data.alarms.length; i++) {
                    data.alarms[i].Line = "";
                    alarmsData.push(data.alarms[i]);
                }
                for (let i = 0; i < data.children.length; i++) {
                    for (let j = 0; j < data.children[i].alarms.length; j++) {
                        data.children[i].alarms[j].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.children[i].alarms[j].START_TIME));
                        data.children[i].alarms[j].Line = data.children[i].alarms[0].ASSET;
                        data.children[i].alarms[j].START_TIME = this.epochToDate(data.children[i].alarms[j].START_TIME);
                        if(data.children[i].alarms[j].SEVERITY == "Alert"){
                            data.children[i].alarms[j][""] = <img src={alert} />;
                            tableAlerts++;
                        }else{
                            data.children[i].alarms[j][""] = <img src={warning} />;
                            tableWarnings++;
                        }
                        alarmsData.push(data.children[i].alarms[j]);
                    }
                    for (let k = 0; k < data.children[i].children.length; k++) {
                        for (let z = 0; z < data.children[i].children[k].alarms.length; z++) {
                            if (data.children[i].alarms.length > 0) {
                                data.children[i].children[k].alarms[z].Line = data.children[i].alarms[0].ASSET;
                            } else {
                                data.children[i].children[k].alarms[z].Line = "";
                            }
                            data.children[i].children[k].alarms[z].Duration = this.millisToMinutesAndSeconds((new Date().getTime() - data.children[i].children[k].alarms[z].START_TIME));
                            data.children[i].children[k].alarms[z].START_TIME = this.epochToDate(data.children[i].children[k].alarms[z].START_TIME);
                            if(data.children[i].children[k].alarms[z].SEVERITY == "Alert"){
                                data.children[i].children[k].alarms[z][""] = <img src={alert} />;
                                tableAlerts++;
                            }else{
                                data.children[i].children[k].alarms[z][""] = <img src={warning} />;
                                tableWarnings++;
                            }
                            
                            alarmsData.push(data.children[i].children[k].alarms[z]);
                        }
                    }
                }
                for(let i=0;i<data.children.length;i++){
                    lineDropdownValue.push(data.children[i].GUID);
                }
                this.setState({ 
                    tableData: alarmsData,
                    plantAssetData :data,
                    lineDropDown : lineDropdownValue,
                    
                 });
                
            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, Alert table data')
            });
    }
    setAutoRefresh = () => {
        this.setState((prevState)=> {
            const {autoRefreshState} = prevState;
            return {
                autoRefreshState: !autoRefreshState,
                buttonLabel : !autoRefreshState ? 'STOP REFRESH' : "START REFRESH"
            }
        }, () => {
            if(this.state.autoRefreshState){
                this.apiTimerReference = setInterval(() => {
                    this.triggerPlantViewData();
                    this.triggerPlantAlertData(); 
                }, 2000);
            } else {
                clearInterval(this.apiTimerReference);
            }
        });
        
    }

    componentDidMount() {
        this.triggerPlantViewData();
        this.triggerPlantAlertData(); 
    }

    componentWillUnmount(){
        tableAlerts=0;
        tableWarnings =0;
    }

    render() {
        const {autoRefreshState, buttonLabel, plantData, plantAssetData, tableData} =  this.state;
        
        return (
            <div className={"data-container plant-view  " + autoRefreshState}>
                <div className="plant-header-label">
                   {plantData.OEE > 0 && <LabelCard heading={"Plant OEE"} value={plantData.OEE} />}<LabelCard heading={"Availability"} value={plantData.Availability} /><LabelCard heading={"Performance"} value={plantData.Performance} /><LabelCard heading={"Quality"} value={plantData.Quality} />
                </div>
                <div className="line-view-container">
                    <div className="line-details card-tile">
                        <div className="plant-view-heading">
                            Plant View
                        </div>
                        {Object.keys(plantAssetData).length>0 && <PlantAsset navigateAsset={this.navigateAsset} data={plantAssetData}/>}
                    </div>
                    <div className="schedule-adherence">
                        <ScheduleAdherence data={plantData} />
                    </div>
                </div>
                <div className="table-details-container card-tile">
                
                {<DataTableComponent filteredData={tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />}
                 <button className="auto-refresh" onClick={this.setAutoRefresh}>{buttonLabel}</button> 
                </div>
            </div>
        );
    }
}

export default PlantView;