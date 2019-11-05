import React from 'react';
import { Panel, Form, FormGroup, FormControl, Checkbox, Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import DateRangePicker from 'react-daterange-picker';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import AlertDetail from './alertDetail';
import './dataTableComponent.css';
import './react-bootstrap-table-all.min.css';
import './react-calendar.css';
import './dataTableComponent-dep.css';
import axios from 'axios';



const moment = extendMoment(Moment);

export class DataTableComponentTabs extends React.Component {

  constructor(props) {
    super(props);
    this.options = {
      showSearchTool: this.showSearchTool.bind(this),
      responsive: true
    };
 
    this.state = {
      activeTabKey: 1,
      isSearchEnabled: true,
      isFilterEnabled: true,
      isCalendarEnabled: true,
      isGeneralOverlayEnabled: false,
      isDateFilterCleared: false,
      responsive: true,
      alertInfoId: [],
      isDetailEnabled: false,
      alertsTableData: [],
      dateValue: null,
      filterItem: [],
      filteredData: [],
      flag:true
    };

    this.showHideFilterTool = this.showHideFilterTool.bind(this);
    this.showHideCalendarTool = this.showHideCalendarTool.bind(this);
    this.handleFilterData = this.handleFilterData.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleTabView = this.handleTabView.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.removeOverlay = this.removeOverlay.bind(this);
    this.openAlertDetail = this.openAlertDetail.bind(this);
    this.alertDetail = this.alertDetail.bind(this);
    this.filterData = [];
    this.parameterData = [];
    var self= this;
  }

  triggerBackNavigation() {
    this.props.history.push({
      pathname: '/prodline',
      state: {
        selectedFactory: this.props.location.state.selectedFactory,
        selectedLine: this.props.history.location.state.selectedLine,
        previousBreadcrumbObject: [this.props.history.location.state.previousBreadcrumbObject]
      }
    })
  }

    componentDidUpdate(){
    if(this.state.flag){
    let alertsData=this.props.alertsTableData;

    this.setState({
      alertsTableData: alertsData,
      filteredData: alertsData,
      flag: false
  });
}
  }

  showSearchTool(el) {
    this.setState({
      isSearchEnabled: true,
      isGeneralOverlayEnabled: !this.state.isGeneralOverlayEnabled,
      isDetailEnabled: false
    });
  }

  openAlertDetail(rowRef, cell, row) {
    this.setState({
      isDetailEnabled: true,
      alertInfoId: [rowRef, cell, row]
    });
  }

  alertDetail(cell, row) {
    return (<a className='alertId' onClick={(e) => this.openAlertDetail.call(this, cell, row)}>{cell}</a>)
  }

  setStatusStyle(cell, row) {
    let styleClassName = '';
    if (cell.toLowerCase() == 'critical') {
      styleClassName = 'text-danger';
    } else if (cell.toLowerCase() == 'non-critical') {
      styleClassName = 'text-primary';
    } else if (cell.toLowerCase() == 'warning') {
      styleClassName = 'text-warning';
    }
    return `<i class='fas fa-circle statusMarker ${styleClassName}' ></i> ${cell}`;
  }

showHideFilterTool(){
  if(this.state.isFilterEnabled){
    this.fetchFilterItems();
  }
  this.setState({
    isFilterEnabled: !this.state.isFilterEnabled,
    isGeneralOverlayEnabled: !this.state.isGeneralOverlayEnabled,
    isDetailEnabled: false
  });
}

showHideCalendarTool(){
  this.setState({
    isCalendarEnabled: !this.state.isCalendarEnabled,
    isGeneralOverlayEnabled: !this.state.isGeneralOverlayEnabled, isDetailEnabled: false
  });
}

handleFilterData(checkedType, e) {
  let filterItems = this.state.filterItem;
  let newFilteredData = [];

  let index = _.findIndex(filterItems, { value: e.target.value });

  if (e.target.checked) {
    if (index == -1) {
      filterItems.push({
        type: checkedType,
        value: e.target.value
      });
    }
  }
  else {
    filterItems.splice(index, 1);
  }

  this.updateFilteredData();

  if (this.state.dateValue) {
    this.handleDateSelect(this.state.dateValue, false);
  }
}

removeFilterItem(item, e){
  let filterItems = this.state.filterItem;
  let index = _.findIndex(filterItems, { value: item.value });
  if (item.type == 'status') {
    let itemInFilterData = _.findIndex(this.filterData, { value: item.value });
    this.filterData[itemInFilterData].checked = false;
  } else {
    let itemInFilterData = _.findIndex(this.parameterData, { value: item.value });
    this.parameterData[itemInFilterData].checked = false;
  }
  document.getElementById(item.value).checked = false;
  filterItems.splice(index, 1);
  this.updateFilteredData();
}

removeDateFilter(e){
  this.setState({
    dateValue: moment.range(moment(new Date()), moment(new Date())),
    isDateFilterCleared: true
  }, function () {
    this.updateFilteredData();
  });
}

clearFilter(){
  let filterData = this.filterData;
  let parameterData = this.parameterData;
  let filterItem = this.state.filterItem;
  filterData.map((item, i) => {
    let itemIndex = _.findIndex(filterItem, { value: item.value });
    filterItem.splice(itemIndex, 1);
    item.checked = false;
    document.getElementById(item.value).checked = false;
  });
  parameterData.map((item, i) => {
    let itemIndex = _.findIndex(filterItem, { value: item.value });
    filterItem.splice(itemIndex, 1);
    item.checked = false;
    document.getElementById(item.value).checked = false;
  });
  this.setState({
    filterItem: filterItem,
    parameterData: parameterData,
    dateValue: moment.range(moment(new Date()), moment(new Date())),
    isDateFilterCleared: true
  }, function () {
    this.updateFilteredData();
  });
}

handleTabView(activeTab){
  this.setState({
    activeTabKey: activeTab,
    isDetailEnabled: false
  }, function () {
    if (!this.state.isDateFilterCleared && this.state.dateValue) {
      this.handleDateSelect(this.state.dateValue, false);
    }
  });
}

handleDateSelect(range, fromDatePicker) {
  const startDate = new Date(range.start._i).getTime();
  const endDate = new Date(range.end._i).getTime();

  let newFilteredData = [];
  let data = this.state.activeTabKey == 1 ? this.state.alertsTableData : "";
  if (this.state.filterItem.length > 0) {
    newFilteredData = data.filter((entry) => {
      const result = [];
      for (let i = 0; i < this.state.filterItem.length; i += 1) {
        if (this.state.filterItem[i].value == entry[this.state.filterItem[i].type]) {
          result.push(this.state.filterItem[i]);
        }
      }
      return result.length > 0 ? true : false;
    })
  } else {
    newFilteredData = data;
  }

  this.setState({
    dateValue: range,
    isDateFilterCleared: false
  }, function () {
    newFilteredData = newFilteredData.filter((entry) => {
      const entryDate = this.state.activeTabKey == 1 ? new Date(entry.dateTime).getTime() : new Date(entry.startDate).getTime();
      return entryDate >= startDate && entryDate <= endDate;
    })

    if (this.state.activeTabKey == 1) {
      this.setState({
        filteredData: newFilteredData
      });
    }
  });
}

updateFilteredData(){
  let filterItems = this.state.filterItem;
  let newFilteredData = [], gridData = [];

  if(filterItems.length > 0 ) {
      if(this.state.dateValue){
          gridData = this.state.filteredData;
      } else {
          gridData = this.state.alertsTableData;
      }
      newFilteredData  = gridData.filter( (entry) => {
        const result = []; 
        for (let i = 0; i < filterItems.length; i+=1) {
          if(filterItems[i].value == entry[filterItems[i].type]){
            result.push(filterItems[i]);
          }
        }        
        return  result.length > 0 ? true :  false; 
      })
  } else {
      newFilteredData = this.state.alertsTableData;
  }

  this.setState({
      filterItem: filterItems,
      filteredData : newFilteredData,
      isDetailEnabled: false
  });
}



removeOverlay(){
  this.setState({
    isSearchEnabled: true,
    isFilterEnabled: true,
    isCalendarEnabled: true,
    isGeneralOverlayEnabled: false
  });
}

fetchFilterItems(){

  let { filterData } = [];
  filterData = _.uniq(_.map(this.state.alertsTableData, 'status'));
  this.filterData = _.map(filterData, function (value, key) {
    return {
      value: value,
      checked: false
    };
  });

  let { parameterData } = [];
  parameterData = _.uniq(_.map(this.state.alertsTableData, 'parameter'));
  this.parameterData = _.map(parameterData, function (value, key) {
    return {
      value: value,
      checked: false
    };
  });
//}

}

render() {

  const { data, isSearchEnabled, isFilterEnabled, isCalendarEnabled, isDateFilterCleared, dateValue, filterItem, filteredData, activeTabKey } = this.state;
  return (
    <Panel id="tableGridPanel">
      <div id="overLay" onClick={(e) => this.removeOverlay()} className={classNames('generalOverlay', {
        'generalOverlayShow': this.state.isGeneralOverlayEnabled,
        'generalOverlayHide': !this.state.isGeneralOverlayEnabled
      })}></div>
      {/* <Panel.Heading>
                  <i className="fas fa-exclamation-triangle tableTools"></i> 
                  <span>Alerts</span>
              </Panel.Heading> */}

      {/* <Panel.Body> */}
      <div className="pull-left selectedTags">
        {this.state.filterItem && this.state.filterItem.map((item, i) =>
          <span key={i} className="filterItemTag">{item.value}
            <i className="fas fa-times filterItemTagClose" onClick={(e) => this.removeFilterItem(item, e)}></i>
          </span>
        )}
        {this.state.dateValue && !this.state.isDateFilterCleared &&
          <span className="filterItemTag">
            {moment(this.state.dateValue.start).format("MM/DD/YYYY")} to {moment(this.state.dateValue.end).format("MM/DD/YYYY")}
            <i className="fas fa-times filterItemTagClose" onClick={(e) => this.removeDateFilter(e)}></i>
          </span>
        }
        {(this.state.filterItem.length > 0 || (this.state.dateValue && !this.state.isDateFilterCleared)) && <span className="clearTag" onClick={this.clearFilter}>Clear tag</span>}
      </div>
      <div className="tableAndFilterContainer">
        <div className="filterIcons">
          <i className="fas fa-calendar pull-right tableTools" onClick={this.showHideCalendarTool}></i>
          <i className="fas fa-filter pull-right tableTools" onClick={this.showHideFilterTool}></i>
          <i className="fab fa-sistrix pull-right tableTools"
            onClick={(e) => this.options.showSearchTool(e)}></i>
          <div ref="filternav" className={classNames('filterOverlay', {
            'filterOverlayHide': isFilterEnabled,
            'filterOverlayShow': !isFilterEnabled
          })} >
            <div>
              <div className="groupHeader"> Status </div>
              {this.filterData && this.filterData.map((entry, i) =>
                <div key={i}>
                  <input type="checkbox" id={entry.value} className="styled-checkbox"
                    onChange={(e) => this.handleFilterData('status', e)} value={entry.value} />
                  <label htmlFor={entry.value}>{entry.value}</label>
                </div>
              )}
            </div>
            <div>
              <div className="groupHeader"> Parameter </div>
              {this.parameterData && this.parameterData.map((entry, i) =>
                <div key={i}>
                  <input type="checkbox" id={entry.value} className="styled-checkbox"
                    onChange={(e) => this.handleFilterData('parameter', e)} value={entry.value} />
                  <label htmlFor={entry.value}>{entry.value}</label>
                </div>
              )}
            </div>
          </div>
          <DateRangePicker className={classNames('calendarOverlay', {
            'calendarOverlayHide': isCalendarEnabled,
            'calendarOverlayShow': !isCalendarEnabled
          })}
            firstOfWeek={1}
            numberOfCalendars={1}
            minimumDate={new Date()}
            value={this.state.dateValue}
            onSelect={this.handleDateSelect}
            minimumDate={new Date("01-01-2010")}
            maximumDate={moment().add(2, 'years').toDate()}
            selectionType='range'
          />
        </div>
        {/* </Panel.Body> */}
        <input type="hidden" value={this.state.activeTabKey} />
        <Tabs defaultActiveKey={this.state.activeTabKey} animation={false} id="noanim" onSelect={this.handleTabView}>
          <Tab eventKey={1} title="Alerts">
            <BootstrapTable ref='alertsTable' containerClass="alertsTable" data={filteredData} striped hover bordered={false} search={isSearchEnabled} multiColumnSearch options={this.options}>
              <TableHeaderColumn isKey dataSort dataField='id' dataFormat={this.alertDetail}>ID</TableHeaderColumn>
              <TableHeaderColumn dataSort dataField='status' dataFormat={this.setStatusStyle}>Status</TableHeaderColumn>
              <TableHeaderColumn dataField='dateTime'>Date &amp; Time</TableHeaderColumn>
              <TableHeaderColumn dataField='activeTime'>Active Time</TableHeaderColumn>
              <TableHeaderColumn dataField='description'>Description</TableHeaderColumn>
              <TableHeaderColumn dataField='parameter'>Parameter</TableHeaderColumn>
              <TableHeaderColumn dataField='location'>Location</TableHeaderColumn>
            </BootstrapTable>
          </Tab>
        </Tabs>
      </div>
      <AlertDetail isDetailEnabled={this.state.isDetailEnabled} alertInfoId={this.state.alertInfoId} ></AlertDetail>
    </Panel>
  );
}
 
}

export default DataTableComponentTabs;

