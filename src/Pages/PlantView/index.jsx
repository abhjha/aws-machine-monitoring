import React from 'react';
import LabelCard from '../../Component/LabelCard';
import ScheduleAdherence from '../../Component/ScheduleAdherence';
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import LineView from '../../Pages/LineView';
import PlantAsset from '../../Component/PlantViewContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var tableAlerts = 0;
var tableWarnings = 0;
var tableAlertsDifference = 0;
var tableWarningDifference = 0;

class PlantView extends React.Component {
    constructor(props) {
        //sessionStorage.autoRefreshState = "false";
        super(props);
        this.state = {
            plantData: {},
            tableData: [],
            plantAssetData: {},
            lineDropDown: [],
            autoRefreshState: sessionStorage.autoRefreshState === "true" ? true : false,
            flag: true,
            filteredData: [],
            refershCount: 0,
            buttonLabel: 'START REFRESH',
            autoRefreshStatus: ''
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

    navigateAsset = (e) => {
        const lineID = e.currentTarget.getAttribute('data-id');
        const lineNameProps = e.currentTarget.childNodes[0].innerText;
        this.props.history.push({
            pathname: '/lineView',
            Component: { LineView },
            state: { lineID, lineNameProps,lineDropDown: this.state.lineDropDown }
        });
    }

    millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + "m : " + (seconds < 10 ? '0' : '') + seconds + "s";
    }

    // notify = (status) => {
    //     if(status == "warning"){
    //         toast.warn("New warning !", {
    //             position: toast.POSITION.TOP_RIGHT
    //           });
    //     }else if(status == "alert"){
    //         toast.error("New alert !", {
    //             position: toast.POSITION.TOP_RIGHT
    //           });
    //     }
        
     
          
   
    //   };

    epochToDate = (dateVal) => {
        dateVal = parseInt(dateVal);
        var zone = "am";
        // var month = [];
        // month[0] = "Jan";
        // month[1] = "Feb";
        // month[2] = "Mar";
        // month[3] = "Apr";
        // month[4] = "May";
        // month[5] = "Jun";
        // month[6] = "Jul";
        // month[7] = "Aug";
        // month[8] = "Sep";
        // month[9] = "Oct";
        // month[10] = "Nov";
        // month[11] = "Dec";
        var date = new Date(dateVal).getDate();
        var monthName = new Date(dateVal).getMonth() + 1;
        // var year = new Date(dateVal).getFullYear();
        var hours = new Date(dateVal).getHours();
        var mins = new Date(dateVal).getMinutes();
        if(hours>12){
            hours = hours-12;
            zone = "pm";
        }
        mins = mins < 10 ? '0'+mins : mins;
        hours = hours < 10 ? '0'+hours : hours;
        // var seconds = new Date(dateVal).getSeconds();

        return  monthName+ "/" + date + " " + hours + ":"+ mins + zone;
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
                    data.alarms[i].Line = "Plant Level";
                    alarmsData.push(data.alarms[i]);
                    if(data.alarms[i].SEVERITY.toLowerCase() == "alert"){
                        tableAlerts++;
                    }else if(data.alarms[i].SEVERITY.toLowerCase() == "warning"){
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
                    if(tableAlerts == 0 && tableWarnings == 0){
                        data.children[i]["backGroundColor"] = "green";
                    }else if(tableAlerts>0){
                        data.children[i]["backGroundColor"] = "red";
                    }else if(tableAlerts ==0 && tableWarnings>0){
                        data.children[i]["backGroundColor"] = "orange";
                    }
                    if(tableWarnings>tableWarningDifference){
                        this.notify("warning");
                    }
                    if(tableAlerts > tableAlertsDifference){
                        this.notify("alert");
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
    //                 this.triggerPlantViewData();
    //                 this.triggerPlantAlertData();
    //             }, 2000);
    //         } else {
    //             clearInterval(this.apiTimerReference);
    //         }
    //     });

    // }
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
        this.triggerPlantViewData();
        this.triggerPlantAlertData();
        if (sessionStorage.autoRefreshState === "true") {
            this.apiTimerReferenceonload = setInterval(() => {
                this.triggerPlantViewData();
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

    render() {
        const { autoRefreshState, plantData, plantAssetData, tableData } = this.state;
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
                        {Object.keys(plantAssetData).length > 0 && <PlantAsset navigateAsset={this.navigateAsset} data={plantAssetData} />}
                    </div>
                    <div className="schedule-adherence">
                        <ScheduleAdherence data={plantData} />
                    </div>
                </div>
                <div className="table-details-container card-tile">

                    {<DataTableComponent filteredData={tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />}
                    {/* <button className={"refresh-button " + autoRefreshStatus} onClick={this.setAutoRefresh}>{buttonLabel}</button> */}
                </div>

                <ToastContainer />
            </div>
        );
    }
}

export default PlantView;