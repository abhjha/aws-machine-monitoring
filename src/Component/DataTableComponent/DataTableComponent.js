import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './dataTableComponent-dep.css';
import alert from '../../Images/alert.png';
import warning from '../../Images/warning.png';
export class DataTableComponent extends React.Component {

  constructor(props) {
    super(props);
    this.options = {
      responsive: true
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
    console.log(this.state.filteredData, "new Table Data");
  }

  setStatusStyle(cell, row) {
    let styleClassName = '';
    if (row.status.toLowerCase() === 'critical') {
      styleClassName = 'text-danger';
    } else if (row.status.toLowerCase() === 'non-critical') {
      styleClassName = 'text-primary';
    } else if (row.status.toLowerCase() === 'warning') {
      styleClassName = 'text-warning';
    }
    return `<i class='fas fa-circle statusMarker ${styleClassName}'></i> ${cell}`;
  }

  render() {
    const { isSearchEnabled } = this.state;
    return (
      <div id="tableGridPanel">
        <div className="alert-zone">
          
          <div className="card-heading"><h1><span >Active</span><span ><img src={alert} /> Alerts {this.state.tableAlerts}</span> and <span><img src={warning} /> Warnings {this.state.tableWarnings}</span></h1></div>
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

export default DataTableComponent;

