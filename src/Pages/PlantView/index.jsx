import React from 'react';
import LabelCard from '../../Component/LabelCard';
import ScheduleAdherence from '../../Component/ScheduleAdherence';
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import LineView from '../../Pages/LineView';
import PlantAsset from '../../Component/PlantViewContainer';
var tableAlerts = 0;
var tableWarnings = 0;

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
        this.props.history.push({
            pathname: '/lineView',
            Component: { LineView },
            state: { lineID, lineDropDown: this.state.lineDropDown }
        });
    }

    millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + "m : " + (seconds < 10 ? '0' : '') + seconds + "s";
    }

    epochToDate = (dateVal) => {
        dateVal = parseInt(dateVal);
        var month = [];
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
        var date = new Date(dateVal).getDate();
        var monthName = month[new Date(dateVal).getMonth()];
        var year = new Date(dateVal).getFullYear();
        var hours = new Date(dateVal).getHours();
        var mins = new Date(dateVal).getMinutes();
        var seconds = new Date(dateVal).getSeconds();

        return date + " " + monthName + " " + year + " : " + hours + ":" + mins + ":" + seconds;
    }

    triggerPlantAlertData = () => {
        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN099')
            .then((response) => response.json())
            .then((data) => {
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
                            if (data.children[i].alarms.length > 0) {
                                data.children[i].children[k].alarms[z].Line = data.children[i].ASSET_NAME;
                            } else {
                                data.children[i].children[k].alarms[z].Line = "";
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
        const { autoRefreshState, buttonLabel, plantData, plantAssetData, tableData, autoRefreshStatus } = this.state;
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
            </div>
        );
    }
}

export default PlantView;