import React, { Component } from 'react';
import Dropdown from '../../Component/Dropdown';
import Back from '../../Component/Back'
import Navigation from '../../Component/Breadcrumb'
import ReactSpeedometer from "react-d3-speedometer"
import { DataTableComponent } from '../../Component/DataTableComponent/DataTableComponent';
import alert from '../../Images/alert.png';
import warning from '../../Images/warning.png';
import Chart from '../../Component/Chart';
import MixRatio from '../../Component/MixRatio';
import { LinearGaugeComponent, AxesDirective, AxisDirective, PointersDirective, PointerDirective, AnnotationsDirective, AnnotationDirective, Annotations, Inject } from '@syncfusion/ej2-react-lineargauge';
var tableData = [];
var tableAlerts = 0;
var tableWarnings = 0;
class HopperView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: ['Plant View', 'Line 3', 'Hopper'],
      dropdownSelectedValue: 'Hopper',
      dropdownOptions: ['Bin', 'Hopper', 'Blender'],
      MixRatioValue: '50:50',
      greenHopperGraphData: {},
      blueHopperGraphData: {
        labels: "",
        datasets: [
          {
            steppedLine: true,
            label: "Actual",
            fill: false,
            data: [],
            backgroundColor: '#1F8EFA',
            borderColor: '#1F8EFA',
            borderWidth: 2,
            pointRadius : 1,
          },
          {
            steppedLine: true,
            fill: false,
            label: "Expected",
            borderColor: '#bb5be3',
            backgroundColor: '#bb5be3',
            data: [],
            borderWidth: 1,
            pointRadius : 1,
          }
        ]
      },
      blueHopperFillValue: 0,
      blueHopperFillTarget: 0,
      greenHopperFillValue: 0,
      greenHopperFillTarget: 0,
      blueHopperGaugeRate: 0,
      greenHopperGaugeRate: 0,
      hopperMixBlue: 0,
      hoppermixLabel: 0,
      gaugeMin: 0,
      gaugeMax: 0,
      buttonLabel: 'START REFRESH',
      autoRefreshStatus: '',
      autoRefreshState: sessionStorage.autoRefreshState === "true" ? true : false,
    }
  }


  setDropdownSelectedValue = (e) => {
    const dropdownSelectedValue = e.currentTarget.getAttribute('data-value');
    //this.setState({ dropdownSelectedValue });
    if (dropdownSelectedValue === 'Bin') {
      this.props.history.push({
        pathname: '/binView',
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
  triggerBlueHopperViewData = () => {
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=SN001&lengthOfHistory=60')
      .then((response) => response.json())
      .then((data) => {
        let timeStampDataObject = data.historicalValues.ActualCurrent == undefined ? [] : Object.keys(data.historicalValues.ActualCurrent);
        var differnceDate = new Date().getTime();
        let timeStampData = timeStampDataObject.map(item => ((differnceDate - item)/1000).toFixed(0));
        timeStampData.push('60s');
        let currentData = data.historicalValues.ActualCurrent == undefined ? [] : Object.values(data.historicalValues.ActualCurrent);
        let expectedData = data.historicalValues.ExpectedCurrent == undefined ? [] : Object.values(data.historicalValues.ExpectedCurrent);
        var gaugeValue = 0;
        if (data.currentValues.HopperFillRate < 0) {
          gaugeValue = 0;
        } else if (data.currentValues.HopperFillRate > data.currentValues.HopperFillRateMax) {
          gaugeValue = data.currentValues.HopperFillRateMax
        } else {
          gaugeValue = data.currentValues.HopperFillRate
        }
        // timeStampData.push('Time(s)');
        this.setState({
          blueHopperFillValue: data.currentValues.hopperLevel,
          blueHopperFillTarget: data.currentValues.HopperLevelTarget,
          hopperMixBlue: data.currentValues.MixActual,
          hoppermixLabel: data.currentValues.MixTarget,
          gaugeMax: data.currentValues.HopperFillRateMax,
          gaugeMin: data.currentValues.HopperFillRateMin,
          blueHopperGaugeRate: gaugeValue,
          blueHopperGraphData: {
            labels: timeStampData,
            datasets: [
              {
                steppedLine: true,
                label: "Actual",
                fill: false,
                data: currentData,
                backgroundColor: '#1F8EFA',
                borderColor: '#1F8EFA',
                borderWidth: 2,
                pointRadius : 1,
              },
              {
                steppedLine: true,
                fill: false,
                label: "Expected",
                borderColor: '#bb5be3',
                backgroundColor: '#bb5be3',
                data: expectedData,
                borderWidth: 1,
                pointRadius : 1,
              }
            ]
          }


        }

        )
      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, blue hopper fill rate data')
      });
  }
  triggerGreenHopperViewData = () => {
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=SN002&lengthOfHistory=60')
      .then((response) => response.json())
      .then((data) => {
        let timeStampDataObject = data.historicalValues.ActualCurrent == undefined ? [] : Object.keys(data.historicalValues.ActualCurrent);
        var differnceDate = new Date().getTime();
        let timeStampData = timeStampDataObject.map(item => ((differnceDate - item)/1000).toFixed(0));
        timeStampData.sort(function(a, b){return b-a});
        timeStampData.unshift("-60");
        let currentData = data.historicalValues.ActualCurrent == undefined ? [] : Object.values(data.historicalValues.ActualCurrent);
        currentData.sort(function(a, b){return b-a});
        currentData.unshift("");
        let expectedData = data.historicalValues.ExpectedCurrent == undefined ? [] : Object.values(data.historicalValues.ExpectedCurrent);
        expectedData.sort(function(a, b){return b-a});
        expectedData.unshift("");
        var gaugeValue = 0;
        if (data.currentValues.HopperFillRate < 0) {
          gaugeValue = 0;
        } else if (data.currentValues.HopperFillRate > data.currentValues.HopperFillRateMax) {
          gaugeValue = data.currentValues.HopperFillRateMax
        } else {
          gaugeValue = data.currentValues.HopperFillRate
        }
        this.setState({
          greenHopperFillValue: data.currentValues.hopperLevel,
          greenHopperFillTarget: data.currentValues.HopperLevelTarget,
          gaugeMax: data.currentValues.HopperFillRateMax,
          gaugeMin: data.currentValues.HopperFillRateMin,
          greenHopperGaugeRate: gaugeValue,
          greenHopperGraphData: {
            labels: timeStampData,
            datasets: [
              {

                label: "Actual",
                backgroundColor: '#1F8EFA',
                borderColor: '#1F8EFA',
                data: currentData,
                borderWidth: 1,
                steppedLine: true,
                fill : false,
                pointRadius: 1,
                // borderColor: '#1F8EFA',
                // backgroundColor: '#1F8EFA',

              },
              {
                
                label: "Expected",
                borderColor: '#bb5be3',
                backgroundColor: '#bb5be3',
                data: expectedData,
                borderWidth: 1,
                steppedLine: true,
                fill : false,
                pointRadius: 1,
              }
            ]
          },
        }
        )
      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, blue hopper fill rate data')
      });
  }
  millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + " m " + (seconds < 10 ? '0' : '') + seconds + "s";
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
  triggerGreenHopperViewTableData = () => {
    tableAlerts = 0;
    tableWarnings = 0;
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN002')
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
            console.log(tableWarnings, "green hopper");
          }
          tableData.push(data.alarms[i]);
        }

      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, green hopper table data')
      });
  }
  triggerBlueHopperViewTableData = () => {
    tableData = [];
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/alarms?GUID=SN001')
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
            console.log(tableWarnings, "blue hopper");
          }
          tableData.push(data.alarms[i]);
        }

      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, blue hopper table data')
      });
  }
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
  //         this.triggerBlueHopperViewData();
  //         this.triggerGreenHopperViewData();
  //         this.triggerBlueHopperViewTableData();
  //         this.triggerGreenHopperViewTableData();

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
    this.triggerBlueHopperViewData();
    this.triggerGreenHopperViewData();
    this.triggerBlueHopperViewTableData();
    this.triggerGreenHopperViewTableData();
    if (sessionStorage.autoRefreshState === "true") {
      this.apiTimerReferenceonload = setInterval(() => {
        this.triggerBlueHopperViewData();
        this.triggerGreenHopperViewData();
        this.triggerBlueHopperViewTableData();
        this.triggerGreenHopperViewTableData();
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
    tableAlerts = 0;
    tableWarnings = 0;
    tableData = [];
    clearInterval(this.apiTimerReference);
    clearInterval(this.apiTimerReferenceonload);
    tableAlerts = 0;
    tableWarnings = 0;
  }
  render() {

    const { greenHopperGraphData,
      blueHopperGraphData,
      blueHopperFillValue,
      blueHopperFillTarget,
      greenHopperFillValue,
      greenHopperFillTarget,
      blueHopperGaugeRate,
      greenHopperGaugeRate,
      hopperMixBlue,
      hoppermixLabel,
      autoRefreshStatus,
      buttonLabel

    } = this.state;
    var annotationContentGreen = `<div style="text-align:left;width:70px;color:white">Target : ${greenHopperFillTarget}</div>`;
    var annotationContentBlue = `<div style="text-align:left;width:70px;color:white">Target : ${blueHopperFillTarget}</div>`


    return (
      <div className="hopperView">
        <div className="tkey-header">
          <Back />
          <Navigation pages={this.state.pages} />
          <div className="page-dropdown-heading">Asset</div>
          <Dropdown
            options={this.state.dropdownOptions}
            setDropdownSelectedValue={this.setDropdownSelectedValue}
            dropdownselectedValue={this.state.dropdownSelectedValue}
          />
        </div>
        <div className="data-container hopper-view">

          <div className="hopper-data-container ">
            <div className="graph-container">

              <div className="hopper-step-graph card-tile">
                {Object.keys(greenHopperGraphData).length > 0 && <Chart chartHeader={'Green Hopper'} data={greenHopperGraphData} />}
              </div>
              <div className="hopper-step-graph card-tile">
                {Object.keys(blueHopperGraphData).length > 0 && <Chart chartHeader={'Blue Hopper'} data={blueHopperGraphData} />}
              </div>
            </div>

            <div className="gauge-container">

              <div className="hopper-gauge card-tile">
                <div className="hopper-rate-heading">
                  Green Fill Rate
                    </div>
                <div className="hopper-rate-meter">
                  <div className="speedoMeter-blue-bin">
                    {this.state.gaugeMin > 0 && <ReactSpeedometer needleHeightRatio={0.7}
                      minValue={0}
                      maxValue={this.state.gaugeMax}
                      height={190}
                      value={greenHopperGaugeRate}
                      customSegmentStops={[0, this.state.gaugeMin, this.state.gaugeMax]}
                      segmentColors={['#EE423D', '#05C985']}
                      ringWidth={30}
                      width={180}
                      currentValueText={"Balls per Minute: " + greenHopperGaugeRate.toFixed(0)}
                      currentValuePlaceholderStyle="#{value}"
                      needleColor={'white'}
                      textColor={'white'}
                    />}
                  </div>
                </div>
              </div>
              <div className="hopper-gauge card-tile">
                <div className="hopper-rate-heading">
                  Blue Hopper Fill Rate
                    </div>
                <div className="hopper-rate-meter">
                  <div className="speedoMeter-blue-bin">
                    {this.state.gaugeMin > 0 && <ReactSpeedometer needleHeightRatio={0.7}
                      minValue={0}
                      height={190}
                      maxValue={this.state.gaugeMax}
                      value={blueHopperGaugeRate}
                      customSegmentStops={[0, this.state.gaugeMin, this.state.gaugeMax]}
                      segmentColors={['#EE423D', '#05C985']}
                      ringWidth={30}
                      width={180}
                      currentValueText={"Balls per Minute: " + blueHopperGaugeRate.toFixed(0)}
                      currentValuePlaceholderStyle="#{value}"
                      needleColor={'white'}
                      textColor={'white'}
                    />}
                  </div>
                </div>
              </div>
            </div>

            <div className="hopper-scale-container">

              <div className="hopper-scale card-tile">
                <div className="hopper-rate-heading">
                  Green Hopper Level
                    </div>
                <LinearGaugeComponent id='gauge2' height='150px' container={{ height: 380, width: 40, type: 'Normal', backgroundColor: '#172030 ' }} orientation={"horizontal"} background={'transparent'} >
                  <Inject services={[Annotations]} />
                  <AxesDirective>
                    <AxisDirective minimum={0} maximum={5} majorTicks={{ interval: 1, color: 'white' }} labelStyle={{ font: { color: 'white' } }} >
                      <PointersDirective>
                        <PointerDirective value={greenHopperFillValue} height={40} type='Bar' color='#05C985'>
                        </PointerDirective>
                      </PointersDirective>
                    </AxisDirective>
                    <AxisDirective minimum={0} maximum={5} line={{ width: 0 }} majorTicks={{ interval: 1, color: 'white' }} labelStyle={{ font: { color: 'white' } }} opposedPosition={true}>
                      <PointersDirective>
                        <PointerDirective width={0}>
                        </PointerDirective>
                      </PointersDirective>
                    </AxisDirective>
                  </AxesDirective>
                  <AnnotationsDirective>
                    <AnnotationDirective content='<div id="title" style="width:3px;height:125px;background-color:white"> </div>' verticalAlignment={"Center"} axisIndex={0} y={20} axisValue={greenHopperFillTarget} zIndex={1}>
                    </AnnotationDirective>
                    <AnnotationDirective content={annotationContentGreen} verticalAlignment={"Center"} axisIndex={0} axisValue={greenHopperFillTarget} y={-60} zIndex='1' >
                    </AnnotationDirective>
                  </AnnotationsDirective>
                </LinearGaugeComponent>
              </div>
              <div className="hopper-scale card-tile">
                <div className="hopper-rate-heading">
                  Blue Hopper Level
                    </div>
                <LinearGaugeComponent id='gauge1' height='150px' container={{ height: 380, width: 40, type: 'Normal', backgroundColor: '#172030' }} orientation={"horizontal"} background={'transparent'} >
                  <Inject services={[Annotations]} />
                  <AxesDirective>
                    <AxisDirective minimum={0} maximum={5} majorTicks={{ interval: 1, color: 'white' }} labelStyle={{ font: { color: 'white' } }} >
                      <PointersDirective>
                        <PointerDirective value={blueHopperFillValue} height={40} type='Bar' color='#1f8efa'>
                        </PointerDirective>
                      </PointersDirective>
                    </AxisDirective>
                    <AxisDirective minimum={0} maximum={5} line={{ width: 0 }} majorTicks={{ interval: 1, color: 'white' }} labelStyle={{ font: { color: 'white' } }} opposedPosition={true}>
                      <PointersDirective>
                        <PointerDirective width={0}>
                        </PointerDirective>
                      </PointersDirective>
                    </AxisDirective>
                  </AxesDirective>
                  <AnnotationsDirective>
                    <AnnotationDirective content='<div id="title" style="width:3px;height:125px;background-color:white"> </div>' verticalAlignment={"Center"} axisIndex={0} y={20} axisValue={blueHopperFillTarget} zIndex={1}>
                    </AnnotationDirective>
                    <AnnotationDirective content={annotationContentBlue} verticalAlignment={"Center"} axisIndex={0} axisValue={blueHopperFillTarget} y={-60} zIndex='1' >
                    </AnnotationDirective>
                  </AnnotationsDirective>
                </LinearGaugeComponent>
              </div>
            </div>
            <div className="mix-hopper card-tile">
              <MixRatio hopperMixBlue={hoppermixLabel} hopperMixBlueActual={hopperMixBlue} hoppermixLabel={hoppermixLabel} />
            </div>
          </div>
          <div className="table-details-container card-tile">
            {<DataTableComponent filteredData={tableData} tableAlerts={tableAlerts} tableWarnings={tableWarnings} />}
            {/* <button className={"refresh-button " + autoRefreshStatus} onClick={this.setAutoRefresh}>{buttonLabel}</button> */}
          </div>
        </div>
      </div>
    );
  }
}

export default HopperView;