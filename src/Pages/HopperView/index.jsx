import React, { Component } from 'react';
import './index.css';
import Dropdown from '../../Component/Dropdown';
import Back from '../../Component/Back'
import Navigation from '../../Component/Breadcrumb'
import ReactSpeedometer from "react-d3-speedometer"
import Table from '../../Component/Table';
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
    console.log(props, "hopperView")
    this.state = {
      pages: ['Plant View', this.props.location.state.lineValue, 'Mixing Unit'],
      dropdownSelectedValue: 'Mixing Unit',
      dropdownOptions: ['Raw Material Bins', 'Mixing Unit', 'Paint Machine'],
      MixRatioValue: '50:50',
      greenHopperGraphData: {},
      blueHopperGraphData: {},
      blueHopperFillValue: 0,
      blueHopperFillTarget: 0,
      greenHopperFillValue: 0,
      greenHopperFillTarget: 0,
      blueHopperGaugeRate: 0,
      greenHopperGaugeRate: 0,
      hopperMixBlue: 0,
      hoppermixLabel: 0,
      gaugeMin: 0,
      gaugeMax: 0
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
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=SN001&lengthOfHistory=5')
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "blue");
        let timeStampDataObject = data.historicalValues.ActualCurrent == undefined ? [] : Object.values(data.historicalValues.ActualCurrent);
        let timeStampData = timeStampDataObject.map(item => new Date(parseInt(item)).getSeconds());
        let currentData = data.historicalValues.ActualCurrent == undefined ? [] : Object.values(data.historicalValues.ActualCurrent);
        let expectedData = data.historicalValues.ExpectedCurrent == undefined ? [] : Object.values(data.historicalValues.ExpectedCurrent);
        timeStampData.push('Time(s)');
        this.setState({
          blueHopperFillValue: data.currentValues.hopperLevel,
          blueHopperFillTarget: data.currentValues.HopperLevelTarget,
          hopperMixBlue: data.currentValues.MixActual,
          hoppermixLabel: data.currentValues.MixTarget,
          gaugeMax: data.currentValues.HopperFillRateMax,
          gaugeMin: data.currentValues.HopperFillRateMin,
          blueHopperGaugeRate: data.currentValues.HopperFillRate,
          blueHopperGraphData: {
            labels: timeStampData,
            datasets: [
              {
                steppedLine: true,
                label: "Current",
                fill: false,
                data: currentData,
                borderColor: '#BB5BE3',
                borderWidth: 1
              },
              {
                steppedLine: true,
                fill: false,
                label: "Expected",
                borderColor: '#1F8EFA',
                data: expectedData,
                borderWidth: 1
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
    fetch('https://5hcex231q7.execute-api.us-east-1.amazonaws.com/prod/properties?GUID=SN002&lengthOfHistory=5')
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "green");
        let timeStampDataObject = data.historicalValues.ActualCurrent == undefined ? [] : Object.values(data.historicalValues.ActualCurrent);
        let timeStampData = timeStampDataObject.map(item => new Date(parseInt(item)).getSeconds());
        let currentData = data.historicalValues.ActualCurrent == undefined ? [] : Object.values(data.historicalValues.ActualCurrent);
        let expectedData = data.historicalValues.ExpectedCurrent == undefined ? [] : Object.values(data.historicalValues.ExpectedCurrent);
        timeStampData.push('Time(s)');
        this.setState({
          greenHopperFillValue: data.currentValues.hopperLevel,
          greenHopperFillTarget: data.currentValues.HopperLevelTarget,
          gaugeMax: data.currentValues.HopperFillRateMax,
          gaugeMin: data.currentValues.HopperFillRateMin,
          greenHopperGaugeRate: data.currentValues.HopperFillRate,
          greenHopperGraphData: {
            labels: timeStampData,
            datasets: [
              {
                steppedLine: true,
                label: "Current",
                fill: false,
                data: currentData,
                borderColor: '#BB5BE3',
                borderWidth: 1
              },
              {
                steppedLine: true,
                fill: false,
                label: "Expected",
                borderColor: '#1F8EFA',
                data: expectedData,
                borderWidth: 1
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
    var date = new Date(parseFloat(dateVal.substr(6)));
    return (
      (date.getMonth() + 1) + "/" +
      date.getDate() + "/" +
      date.getFullYear() + " " +
      date.getHours() + ":" +
      date.getMinutes() + ":" +
      date.getSeconds()
    );
  }
  triggerGreenHopperViewTableData = () => {
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
          }
          tableData.push(data.alarms[i]);
        }

      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, green hopper table data')
      });
  }
  triggerBlueHopperViewTableData = () => {
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
          }
          tableData.push(data.alarms[i]);
        }

      })
      .catch(function (err) {
        console.log(err, 'Something went wrong, blue hopper table data')
      });
  }

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
    } = this.state;
    const graphoptions = {
      scales: {
        yAxes: [{
          ticks: {
            ticks: {
              min: 0,
              max: 100,

              // forces step size to be 5 units
              stepSize: 20 // <----- This prop sets the stepSize
            }
          }
        }]
      }
    }


    return (
      <div className="hopperView">
        <div className="data-container">
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
          <div className="bin-container">
            <div className="bin-container-heading">
              Mixing Unit
            </div>
            <div className="hopper-data-container">
              <div className="graph-container">
                <div className="hopper-step-graph">
                  {Object.keys(blueHopperGraphData).length > 0 && <Chart chartHeader={'Dye Hopper'} data={blueHopperGraphData} options={graphoptions} />}
                </div>
                <div className="hopper-step-graph">
                  {Object.keys(greenHopperGraphData).length > 0 && <Chart chartHeader={'Sealant Hopper'} data={greenHopperGraphData} options={graphoptions} />}
                </div>
              </div>

              <div className="gauge-container">
                <div className="hopper-gauge">
                  <div className="hopper-rate-heading">
                    Dye Hopper Fill Rate
                    </div>
                  <div className="hopper-rate-meter">
                    <div className="speedoMeter-blue-bin">
                      {this.state.gaugeMin > 0 && <ReactSpeedometer needleHeightRatio={0.7}
                        minValue={0}
                        height={130}
                        maxValue={100}
                        value={blueHopperGaugeRate}
                        customSegmentStops={[0, this.state.gaugeMin, this.state.gaugeMax, 100]}
                        segmentColors={['#EE423D', '#05C985', '#EE423D']}
                        ringWidth={10}
                        width={130}
                        currentValueText="Litres per Minute"
                        currentValuePlaceholderStyle="#{value}"
                        needleColor={'white'}
                        textColor={'white'}
                      />}
                      <p>Litres per minute</p>
                    </div>
                  </div>
                </div>
                <div className="hopper-gauge">
                  <div className="hopper-rate-heading">
                  Sealant Fill Rate
                    </div>
                  <div className="hopper-rate-meter">
                    <div className="speedoMeter-blue-bin">
                      {this.state.gaugeMin > 0 && <ReactSpeedometer needleHeightRatio={0.7}
                        minValue={0}
                        maxValue={100}
                        height={130}
                        value={greenHopperGaugeRate}
                        customSegmentStops={[0, this.state.gaugeMin, this.state.gaugeMax, 100]}
                        segmentColors={['#EE423D', '#05C985', '#EE423D']}
                        ringWidth={10}
                        width={130}
                        currentValueText="Litres per Minute"
                        currentValuePlaceholderStyle="#{value}"
                        needleColor={'white'}
                        textColor={'white'}
                      />}
                      <p>Litres per minute</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hopper-scale-container">
                <div className="hopper-scale">
                  <div className="hopper-rate-heading">
                    Dye Hopper Level
                    </div>
                  <LinearGaugeComponent id='gauge1' height='150px' container={{ height: 380, width: 40, type: 'Normal', backgroundColor: '#242e42' }} orientation={"horizontal"} background={'transparent'} >
                    <Inject services={[Annotations]} />
                    <AxesDirective>
                      <AxisDirective minimum={0} maximum={5} majorTicks={{ interval: 1, color: '#252f43' }} minorTicks={{ interval: 0.1, color: '#252f43' }} labelStyle={{ font: { color: 'white' } }} >
                        <PointersDirective>
                          <PointerDirective value={blueHopperFillValue} height={40} type='Bar' color='#1f8efa'>
                          </PointerDirective>
                        </PointersDirective>
                      </AxisDirective>
                      <AxisDirective minimum={0} maximum={5} line={{ width: 0 }} majorTicks={{ interval: 1, color: '#252f43' }} minorTicks={{ interval: 0.1, color: '#252f43' }} labelStyle={{ font: { color: 'white' } }} opposedPosition={true}>
                        <PointersDirective>
                          <PointerDirective width={0}>
                          </PointerDirective>
                        </PointersDirective>
                      </AxisDirective>
                    </AxesDirective>
                    <AnnotationsDirective>
                      <AnnotationDirective content='<div id="title" style="width:3px;height:125px;background-color:white"> </div>' verticalAlignment={"Center"} x={blueHopperFillTarget * 76 + 32} zIndex={1}>
                      </AnnotationDirective>
                      <AnnotationDirective content='<div style="text-align:left;color:white">Target</div>' verticalAlignment={"Center"} x={blueHopperFillTarget * 76 + 32} y={-80} zIndex='1' >
                      </AnnotationDirective>
                    </AnnotationsDirective>
                  </LinearGaugeComponent>
                </div>
                <div className="hopper-scale">
                  <div className="hopper-rate-heading">
                    Sealant Hopper Level
                    </div>
                  <LinearGaugeComponent id='gauge2' height='150px' container={{ height: 380, width: 40, type: 'Normal', backgroundColor: '#242e42' }} orientation={"horizontal"} background={'transparent'} >
                    <Inject services={[Annotations]} />
                    <AxesDirective>
                      <AxisDirective minimum={0} maximum={5} majorTicks={{ interval: 1, color: '#252f43' }} minorTicks={{ interval: 0.1, color: '#252f43' }} labelStyle={{ font: { color: 'white' } }} >
                        <PointersDirective>
                          <PointerDirective value={greenHopperFillValue} height={40} type='Bar' color='#05C985'>
                          </PointerDirective>
                        </PointersDirective>
                      </AxisDirective>
                      <AxisDirective minimum={0} maximum={5} line={{ width: 0 }} majorTicks={{ interval: 1, color: '#252f43' }} minorTicks={{ interval: 0.1, color: '#252f43' }} labelStyle={{ font: { color: 'white' } }} opposedPosition={true}>
                        <PointersDirective>
                          <PointerDirective width={0}>
                          </PointerDirective>
                        </PointersDirective>
                      </AxisDirective>
                    </AxesDirective>
                    <AnnotationsDirective>
                      <AnnotationDirective content='<div id="title" style="width:3px;height:125px;background-color:white"> </div>' verticalAlignment={"Center"} x={greenHopperFillTarget * 76 + 32} zIndex={1}>
                      </AnnotationDirective>
                      <AnnotationDirective content='<div style="text-align:left;color:white">Target</div>' verticalAlignment={"Center"} x={greenHopperFillTarget * 76 + 32} y={-80} zIndex='1' >
                      </AnnotationDirective>
                    </AnnotationsDirective>
                  </LinearGaugeComponent>
                </div>
              </div>
              <div className="mix-hopper">
                <MixRatio hopperMixBlue={hopperMixBlue} hoppermixLabel={hoppermixLabel} />
              </div>
            </div>
          </div>

          <div className="table-details-container">
            <div className="table-summary"><span >Active</span><span ><img src={alert} /> Alerts {tableAlerts}</span> and <span><img src={warning} /> Warnings {tableWarnings}</span></div>
            <div className="table-date">{tableData.length > 0 && <Table data={tableData} />} </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HopperView;