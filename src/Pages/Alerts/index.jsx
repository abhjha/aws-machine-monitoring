import React, { Component } from 'react';
import Button from '../../Component/Button';
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import alert from '../../Images/alert.png';
import warning from '../../Images/warning.png';
var tableAlerts =0;
var tableWarnings =0;
class AlertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetButton: "Reset",
            activeButton: "Active",
            resolvedButton: "Resolved",
            tableFilterData:[{}],
            tableData: [],
        }
    }

    filterAlarms = (e) => {
        const filterValue = e.target;
        if(filterValue.innerHTML ==='Reset'){
            this.setState({tableFilterData: this.state.tableData});
            
        } else {
            filterValue.classList.add("active");
            const filterResult = this.state.tableData.filter(item=> item.STATUS === filterValue);
            this.setState({tableFilterData: filterResult});
    
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

    triggerPlantAlertData = () => {
        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN099')
            .then((response) => response.json())
            .then((data) => {
                var alarmsData = [];
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
                this.setState({ 
                    tableFilterData: alarmsData,
                    tableData : alarmsData
                 });
                console.log(this.state.tableData);
            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, Alert table data')
            });
    }

    componentDidMount(){
        
        this.triggerPlantAlertData();
        this.setState({tableFilterData: this.state.tableData});
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
                            <Button type={'reset'} labelName={this.state.resetButton} triggerAction={this.filterAlarms}  />
                        </div>
                    </div>
                    <div className="page-buttons">
                        <Button labelName={this.state.activeButton} triggerAction={this.filterAlarms} /> 
                        <Button labelName={this.state.resolvedButton} triggerAction={this.filterAlarms} />
                    </div>
                    <div className="table-alert-details-container card-tile">
                    <DataTableComponent filteredData={this.state.tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />
                    </div>
                </div>
            </div> 
        );

    }
}

export default AlertView;