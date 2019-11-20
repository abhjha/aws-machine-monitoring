import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// import './dataTableComponent-dep.css';

export class ZoneDatatable extends React.Component {

  constructor(props) {
    super(props);
    this.options = {
        responsive: true
    };
    this.state = {
        isSearchEnabled: true,
        isFilterEnabled: true,
        filterItem : [],
        zoneName: "",
        filteredZoneData: {}
    };
  }
  
  setStatusStyle(cell, row){
     let styleClassName = '';
      if(row.status.toLowerCase() === 'critical'){
        styleClassName = 'text-danger';
      } else if(row.status.toLowerCase() === 'non-critical'){
        styleClassName = 'text-primary';
      } else if(row.status.toLowerCase() ==='waiting'){
        styleClassName = 'text-warning';
      }
      return `<i class='fas fa-circle statusMarker ${ styleClassName }' ></i> ${cell}`; 
  }
  // triggerZoneViewTable = () => {
  //   fetch('https://iy78q5dt50.execute-api.us-west-2.amazonaws.com/Stage/GetMaterialHistory?zoneId=zone001')
  //     .then(resp => resp.json())
  //     .then(response => {
  //       this.setState({
  //         filteredZoneData: response,
  //         zoneName: response.SelectedZone[0].zoneName
  //       })
  //     });
  // }
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
            console.log(data,"zonview table data");
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
                        data.children[i].alarms[j][""] = "<img src={alert} />";
                    }else{
                        data.children[i].alarms[j][""] = "<img src={warning} />";
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
                            data.children[i].children[k].alarms[z][""] = "<img src={alert} />";
                        }else{
                            data.children[i].children[k].alarms[z][""] = "<img src={warning} />";
                        }
                        
                        alarmsData.push(data.children[i].children[k].alarms[z]);
                    }
                }
            }
            for(let i=0;i<data.children.length;i++){
                lineDropdownValue.push(data.children[i].GUID);
            }
            console.log(alarmsData, "zone sasmple data");
            this.setState({ 
                filteredZoneData: data.children[1].children[0].alarms,

             });
            
        })
        .catch(function (err) {
            console.log(err, 'Something went wrong, Alert table data')
        });
}

  componentDidMount = () => {
    this.triggerPlantAlertData().bind(this);
  }


 render() {
    
  console.log(this.state.filteredZoneData,"zoneview table");
    const { isSearchEnabled} = this.state; 
   
          return ( 
            
          <div id="tableGridPanel">
            <div className="alert-zone">
           
            <div className="alerts-zone-heading">{this.state.zoneName}</div>
            
            </div>
              
                <div className="tableAndFilterContainer withoutTabs">
                    <div className="filterIcons">
                        <i className="fas fa-calendar pull-right tableTools" onClick={this.showHideCalendarTool}></i>       
                        <i className="fas fa-filter pull-right tableTools" onClick={this.showHideFilterTool}></i> 
                        <i className="fab fa-sistrix pull-right tableTools" 
                            onClick={(e) => this.options.showSearchTool(e)}></i>
                       
                    </div>
                   
                    <input type="hidden" value={this.state.activeTabKey} />
                   

                            <BootstrapTable 
                            ref='alertsTable' containerClass="alertsTable" data={this.state.filteredData} striped hover bordered={false} search={isSearchEnabled} multiColumnSearch options={this.options}>
                            <TableHeaderColumn width='30' dataField='statusBox' border='0'></TableHeaderColumn>
                            <TableHeaderColumn width='90' headerAlign='center' dataAlign='center' isKey dataField='LINE' dataFormat={this.alertDetails}>LINE</TableHeaderColumn>
                            <TableHeaderColumn headerAlign='center' dataAlign='center' dataSort dataField='ASSET' >Asset</TableHeaderColumn>
                            <TableHeaderColumn headerAlign='center' dataAlign='center' dataField='ASSET_TYPE' >Asset Type</TableHeaderColumn>
                            <TableHeaderColumn headerAlign='center' dataAlign='center' dataField='DESCRIPTION'>Description</TableHeaderColumn>
                            <TableHeaderColumn headerAlign='center' dataAlign='center' dataField='STATUS'>Status</TableHeaderColumn>
                            <TableHeaderColumn headerAlign='center' dataAlign='center' dataField='START_TIME'>Start Time</TableHeaderColumn>
                            <TableHeaderColumn headerAlign='center' dataAlign='center' dataField='SEVERITY'>Severity</TableHeaderColumn>
                               
                            </BootstrapTable>
                </div>
          </div>
    );
  }
 
}

export default ZoneDatatable;

