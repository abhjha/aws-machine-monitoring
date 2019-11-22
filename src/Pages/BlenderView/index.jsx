import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Dropdown from '../../Component/Dropdown';
import BackButton from '../../Component/Back';
import Breadcrumb from '../../Component/Breadcrumb';
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import alert from '../../Images/alert.png';
import { Bar } from 'react-chartjs-2';
import warning from '../../Images/warning.png';
import AmbientReadings from '../../Component/AmbientReading';
import ReactSpeedometer from "react-d3-speedometer";
import { LinearGaugeComponent, AxesDirective, AxisDirective, PointersDirective, PointerDirective, AnnotationsDirective, AnnotationDirective, Annotations, Inject } from '@syncfusion/ej2-react-lineargauge';
var tableWarnings = 0;
var tableAlerts = 0;
class BlenderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ['Plant View', sessionStorage.lineName, 'Blender'],
            dropdownSelectedValue: 'Blender',
            selectedLine: 'Line_3',
            tableData: [],
            dropdownOptions: ['Bin', 'Hopper', 'Blender'],
            blenderGraphData: {
                labels: [],
                datasets: [{
                    label: "",
                    backgroundColor: '#05C985',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [],
                }]
            },
            ambientTemperature: 0,
            ambientHumidity: 0,
            ambientPressure: 0,
            blenderSpeed: 0,
            blenderTemperature: 0,
            tempLowerBound: 0,
            tempUpperBound: 0,
            blenderVibrationAlert: 0,
            blenderVibrtionWarning: 0,
            minBlenderSpeed: 0,
            maxBlenderSpeed: 0,
            temperatureBackground: "",
            buttonLabel: 'START REFRESH',
            autoRefreshStatus: '',
            autoRefreshState: sessionStorage.autoRefreshState === "true" ? true : false,
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
        } else if (dropdownSelectedValue === 'Finished Goods View') {
            this.props.history.push({
                pathname: '/finishedGoodsView',
                state: { lineValue: this.props.location.state.lineValue },
            });
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

    getBarColor = (data , warning , alert) =>{
        if(data<=warning){
            return "#05C985";
        } else if(data>warning && data<=alert){
            return "orange";
        } else if(data > alert){
            return "#EE423D";
        }
    }
    blednerViewData = () => {
        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=SN003&lengthOfHistory=5')
            .then((response) => response.json())
            .then((blenderData) => {
                console.log(blenderData);
                var blnderTempBG = "";
                if (blenderData.currentValues.ThermometerTemperature > blenderData.currentValues.TemperatureUpperLimit || blenderData.currentValues.ThermometerTemperature < blenderData.currentValues.TemperatureLowerLimit) {
                    blnderTempBG = "#EE423D";
                } else {
                    blnderTempBG = "#05c985";
                } 
                this.setState({
                    ambientPressure: blenderData.currentValues.AmbientPressure,
                    ambientTemperature: blenderData.currentValues.AmbientTemperature,
                    ambientHumidity: blenderData.currentValues.AmbientHumidity,
                    blenderTemperature: blenderData.currentValues.ThermometerTemperature,
                    tempLowerBound: blenderData.currentValues.TemperatureLowerLimit,
                    tempUpperBound: blenderData.currentValues.TemperatureUpperLimit,
                    temperatureBackground: blnderTempBG,
                    blenderGraphData: {
                        labels: ["Motor", "Bearing 1", "Bearing 2"],
                        datasets: [{
                            label: "",
                            backgroundColor: [this.getBarColor(blenderData.currentValues.Motor,blenderData.currentValues.VibrationWarningLevel,blenderData.currentValues.VibrationAlertLevel), 
                                this.getBarColor(blenderData.currentValues.Bearing1,blenderData.currentValues.VibrationWarningLevel,blenderData.currentValues.VibrationAlertLevel), 
                                this.getBarColor(blenderData.currentValues.Bearing2,blenderData.currentValues.VibrationWarningLevel,blenderData.currentValues.VibrationAlertLevel)],
                            borderColor: 'rgb(255, 99, 132)',
                            data: [blenderData.currentValues.Motor, blenderData.currentValues.Bearing1, blenderData.currentValues.Bearing2],

                        }]
                    },
                    blenderVibrationAlert: blenderData.currentValues.VibrationAlertLevel,
                    blenderVibrtionWarning: blenderData.currentValues.VibrationWarningLevel,
                    minBlenderSpeed: blenderData.currentValues.SpeedLowerLimit,
                    maxBlenderSpeed: blenderData.currentValues.SpeedUpperLimit,
                    blenderSpeed: blenderData.currentValues.BlenderSpeed,
                })
            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, Alert summary data')
            });
    }
    //Table summary data 
    tableSummaryData = () => {
        fetch('https://3e0n7ol0r9.execute-api.us-east-1.amazonaws.com/default ')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    tableAlerts: data.Alerts,
                    tableWarnings: data.Warnings,
                })
            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, Alert summary data')
            });
    }
    //Alert Table Data
    triggerBlenderTableData = () => {
        tableAlerts =0;
        tableWarnings =0;
        fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN003')
            .then((response) => response.json())
            .then((data) => {
                var alarmsData = [];
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
                    alarmsData.push(data.alarms[i]);
                }
                this.setState({
                    tableData: alarmsData,
                })

            })
            .catch(function (err) {
                console.log(err, 'Something went wrong, blender table data')
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
    //                 this.triggerBlenderTableData();
    //                 this.blednerViewData();
    //             }, 2000);
    //         } else {
    //             clearInterval(this.apiTimerReference);
    //         }
    //     });

    // }
    componentDidMount() {
        // const responseHeader = {
        //   headers: {
        //     'X-API-KEY': 'k1AHdHjUI45HGsWfQasE28qqWT4nRflZ4q2rqNTw'
        //   }
        // };
        this.triggerBlenderTableData();
        this.blednerViewData();
        if( sessionStorage.autoRefreshState === "true"){
            this.apiTimerReferenceonload = setInterval(() => {
            this.triggerBlenderTableData();
            this.blednerViewData(); 
        }, 2000);
        this.setState(()=> {
            return {
                autoRefreshState: true,
                buttonLabel : 'STOP REFRESH',
                autoRefreshStatus : 'auto-refresh' ,
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
                    value: this.state.blenderVibrationAlert,
                    borderColor: 'white',
                    borderWidth: 2,
                    borderDash: [3, 3],
                    label: {
                        content: "Alert",
                        enabled: true,
                        position: "bottom",
                        xAdjust: 217,
                        yAdjust: 20,
                        backgroundColor: 'transparent'
                    }
                },
                {
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: this.state.blenderVibrtionWarning,
                    borderColor: 'white',
                    borderWidth: 2,
                    borderDash: [3, 3],
                    label: {
                        content: "Warning",
                        enabled: true,
                        position: "bottom",
                        xAdjust: 217,
                        yAdjust: 20,
                        backgroundColor: 'transparent'
                    }
                }
                ],
                drawTime: "afterDraw",
            },
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
                        fontColor: "white",
                        beginAtZero: true,
                        min: 0,
                        max: 1,
                        stepSize: 0.1
                    },

                }]
            },
        };
        console.log(this.state.minBlenderSpeed, this.state.maxBlenderSpeed, this.state.BlenderSpeed);
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
                <div className="data-container blender-view">
                    <div className="blender-graph-container ">
                        <div className="blender-graph card-tile">
                            <div className="hopper-rate-heading">
                                Vibration Readings
                            </div>
                            <Bar data={this.state.blenderGraphData} options={graphOptions}
                            />
                        </div>
                        <div className="blender-reading card-tile">
                            <div className="hopper-rate-heading">
                                Ambient Readings
                            </div>
                            <AmbientReadings temp={this.state.ambientTemperature} humidity={this.state.ambientHumidity} pressure={this.state.ambientPressure} />
                        </div>
                        <div className="blender-temp card-tile">
                            <div className="hopper-rate-heading blend-temp">
                               Temperature
                            </div>
                            {this.state.tempLowerBound > 0 && <LinearGaugeComponent id='gauge1' height='320px' container={{ type: 'Normal', backgroundColor: '#172030', height: 300, width: 30 }} background={'transparent'} margin={{ top: 0 }}>
                                <Inject services={[Annotations]} />
                                <AxesDirective>
                                    <AxisDirective minimum={0} maximum={500} majorTicks={{ interval: 50, color: 'white' }} minorTicks={{ interval: 10, color: 'white' }} labelStyle={{ font: { color: 'white' } }} >
                                        <PointersDirective>
                                            <PointerDirective value={this.state.blenderTemperature} height={40} width={25} type='Bar' color={this.state.temperatureBackground}>
                                            </PointerDirective>
                                        </PointersDirective>
                                    </AxisDirective>
                                </AxesDirective>
                                <AnnotationsDirective>
                                    <AnnotationDirective content='<div id="title" style="width:55px;height:2px;background-color:white"> </div>' verticalAlignment={"Center"} axisIndex={0} x = {10} zIndex={1} axisValue={this.state.tempLowerBound}>
                                    </AnnotationDirective>
                                    <AnnotationDirective content='<div id="title" style="width:55px;height:2px;background-color:white"> </div>' verticalAlignment={"Center"} axisIndex={0} x = {10} zIndex={1} axisValue={this.state.tempUpperBound}>
                                    </AnnotationDirective>
                                </AnnotationsDirective>
                            </LinearGaugeComponent>}
                        </div>
                        <div className="blender-speed card-tile">
                            <div className="hopper-rate-heading">
                                Blender Speed
                            </div>
                            <div className="blender-speed-value">
                                {this.state.minBlenderSpeed > 0 && <ReactSpeedometer needleHeightRatio={0.7}
                                    minValue={0}
                                    height={280}
                                    maxValue={50}
                                    value={this.state.blenderSpeed}
                                    customSegmentStops={[0, this.state.minBlenderSpeed, this.state.maxBlenderSpeed, 50]}
                                    // startColor={"red"}
                                    // endColor={"green"}
                                    segmentColors={['#EE423D', '#05C985', '#EE423D']}
                                    ringWidth={40}
                                    width={280}
                                    currentValueText={"RPM : " + this.state.blenderSpeed}
                                    currentValuePlaceholderStyle="#{value}"
                                    needleColor={'white'}
                                    textColor={'white'}
                                />}
                            </div>

                        </div>
                    </div>
                    <div className="table-details-container card-tile">
                        {<DataTableComponent filteredData={this.state.tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />}
                        {/* <button className={"refresh-button " + this.state.autoRefreshStatus} onClick={this.setAutoRefresh}>{this.state.buttonLabel}</button> */}
                    </div>
                </div>
            </div>
        );

    }
}
export default withRouter(BlenderView);