import React, { useState } from 'react';


function SetpointTable (props){
    return (
        <div className="sp-table-container">
            {props.data.map(item=> <div className={"sp-table-value"}>{item}</div>)}
        </div>
    )
}

export default SetpointTable;