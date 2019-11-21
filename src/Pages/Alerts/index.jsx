import React, { Component } from 'react';
import Button from '../../Component/Button';
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import alert from '../../Images/alert.png';
import warning from '../../Images/warning.png';
var tableAlerts = 0;
var tableWarnings = 0;
class AlertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetButton: "Reset",
            activeButton: "Active",
            resolvedButton: "Resolved",
            tableFilterData: [{}],
            tableData: [],
            buttonLabel: 'START REFRESH',
            autoRefreshStatus: '',
            autoRefreshState: sessionStorage.autoRefreshState === "true" ? true : false,
        }
    }

    filterAlarms = (e) => {
        const filterValue = e.target;
        if (filterValue.innerHTML === 'Reset') {
            this.setState({ tableFilterData: this.state.tableData });

        } else {
            filterValue.classList.add("active");
            const filterResult = this.state.tableData.filter(item => item.STATUS === filterValue.innerHTML);
            this.setState({ tableFilterData: filterResult });

        }
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
        var date = new Date(dateVal).getDate();
        var monthName = new Date(dateVal).getMonth() + 1;
        var hours = new Date(dateVal).getHours();
        var mins = new Date(dateVal).getMinutes();
        if(hours>12){
            hours = hours-12;
            zone = "pm";
        }
        mins = mins < 10 ? '0'+mins : mins;
        hours = hours < 10 ? '0'+hours : hours;

        return  monthName+ "/" + date + " " + hours + ":"+ mins + zone;
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
    setAutoRefresh = () => {
        clearInterval(this.apiTimerReferenceonload);
        this.setState((prevState) => {
            const { autoRefreshState } = prevState;
            sessionStorage.autoRefreshState = autoRefreshState ? "false" : "true";

            return {
                autoRefreshState: !autoRefreshState,
                buttonLabel: !autoRefreshState ? 'STOP REFRESH' : "START REFRESH",
                autoRefreshStatus: !autoRefreshState ? 'auto-refresh' : "",
            }
        }, () => {
            if (this.state.autoRefreshState) {
                this.apiTimerReference = setInterval(() => {
                    this.triggerPlantAlertData();
                }, 2000);
            } else {
                clearInterval(this.apiTimerReference);
            }
        });

    }
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
        tableAlerts=0;
        tableWarnings =0;
    }


    render() {

        return (
            <div className="alertView">
                <div className="data-container alert-view">
                    <div className="alert-page-header card-tile">
                        <div className="alert-page-header-value">
                            Activity Log
                        </div>
                        <div className="alog-reset">
                            <Button type={'reset'} labelName={this.state.resetButton} triggerAction={this.filterAlarms} />
                            <Button type={'refresh-button ' + this.state.autoRefreshStatus} labelName={this.state.buttonLabel} triggerAction={this.setAutoRefresh} />
                            
                        </div>
                    </div>
                    <div className="page-buttons">
                        <Button labelName={this.state.activeButton} triggerAction={this.filterAlarms} />
                        <Button labelName={this.state.resolvedButton} triggerAction={this.filterAlarms} />
                    </div>
                    <div className="table-alert-details-container card-tile">
                        {<DataTableComponent filteredData={this.state.tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />}
                        
                    </div>
                </div>
            </div>
        );

    }
}

export default AlertView;