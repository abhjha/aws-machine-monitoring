import React, { useState } from 'react';


function SetpointTable (props){
    return (
        <div className="sp-table-container">
            {props.data.map(item=> <div className={"sp-table-value"}>{item.split(',')[0]}<sup>{item.split(',')[1]}</sup></div>)}
        </div>
    )
}

export default SetpointTable;