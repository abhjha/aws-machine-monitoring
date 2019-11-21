import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './dataTableComponent-dep.css';
import alert from '../../Images/alert.png';
import warning from '../../Images/warning.png';
export class DataTableComponent extends React.Component {

  constructor(props) {
    super(props);
    this.options = {
      responsive: true,
      defaultSortName: 'START_TIME',  // default sort column name
      defaultSortOrder: 'desc'  // default sort order
    };
    this.state = {
      isSearchEnabled: true,
      isFilterEnabled: true,
      filterItem: [],
      filteredData: props.filteredData,
      filteredZoneData: props.filteredZoneData,
      tableAlerts : props.tableAlerts,
      tableWarnings : props.tableWarnings
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      filteredData: props.filteredData,
    }
  }

  setStatusStyle(cell, row) {
    let styleClassName = '';
    if (row.SEVERITY.toLowerCase() === 'alert') {
      styleClassName = 'text-danger';
    } else if (row.SEVERITY.toLowerCase() === 'non-critical') {
      styleClassName = 'text-primary';
    } else if (row.SEVERITY.toLowerCase() === 'warning') {
      styleClassName = 'text-warning';
    }
    return `<i class='fas fa-circle statusMarker ${styleClassName}'></i> ${cell}`;
  }
  // convertLowerCase(cell, row){
  //   return "het check test case capital letters";
  // }
  render() {
    const { isSearchEnabled } = this.state;
    return (
      
      <div id="tableGridPanel">
        <div className="alert-zone">
          
          <div className="card-heading"><h1><span >Active &emsp; </span><span ><img src={alert} /> Alerts: {this.props.tableAlerts}</span>  &emsp; <span><img src={warning} /> Warnings: {this.props.tableWarnings}</span></h1></div>
        </div>

        <div className="tableAndFilterContainer withoutTabs">
          {/* <div className="filterIcons">
            <i className="fas fa-calendar pull-right tableTools" onClick={this.showHideCalendarTool}></i>
            <i className="fas fa-filter pull-right tableTools" onClick={this.showHideFilterTool}></i>
            <i className="fab fa-sistrix pull-right tableTools"
              onClick={(e) => this.options.showSearchTool(e)}></i>
          </div> */}
          <input type="hidden" value={this.state.activeTabKey} />
          {<BootstrapTable
            ref='alertsTable' containerClass="alertsTable" data={this.state.filteredData} striped hover bordered={false} search={isSearchEnabled} multiColumnSearch options={this.options}>
            <TableHeaderColumn width='30' dataField='statusBox' dataFormat={this.setStatusStyle} border='0'></TableHeaderColumn>
            <TableHeaderColumn width='90' headerAlign='center' dataAlign ='center'  isKey dataField='Line' >LINE</TableHeaderColumn>
            <TableHeaderColumn headerAlign='center'  dataAlign ='center' dataField='ASSET' >Asset</TableHeaderColumn>
            <TableHeaderColumn headerAlign='center' dataAlign ='center' width='450' dataField='DESCRIPTION'>Description</TableHeaderColumn>
            <TableHeaderColumn headerAlign='center' dataAlign ='center'  dataField='STATUS'>Status</TableHeaderColumn>
            <TableHeaderColumn headerAlign='center'  dataAlign ='center' dataField='START_TIME'  >Start Time</TableHeaderColumn>
            <TableHeaderColumn headerAlign='center'  dataAlign ='center' dataField='Duration' >Duration</TableHeaderColumn>
          </BootstrapTable>}
        </div>
      </div>
    );
  }

}

export default DataTableComponent;

