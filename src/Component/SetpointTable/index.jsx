import React, { useState } from 'react';


function SetpointTable (props){
    function setpointTableData (data) {
        if(data.split(',').length == 1){
            return (data);
        }else if(data.split(',').length == 2){
        return (<div>{data.split(',')[0]}<sup>{data.split(',')[1]}</sup></div>);
        }else if(data.split(',').length >2){
            return (<div>{data.split(',')[0]}<br/>{data.split(',')[1]}<br/>{data.split(',')[2]}<br/>{data.split(',')[3]}</div>)
        }

    }
    return (
        <div className="sp-table-container">
            {props.data.map(item=> <div className={"sp-table-value"}>{setpointTableData(item)}</div>)}
        </div>
    )
}

export default SetpointTable;