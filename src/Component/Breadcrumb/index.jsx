import React, { useState } from 'react';
import './index.css';

const pages =["Plant View", "Line 03", "Bins" ];

function Navigation (props){
    return (
        <div className="tkey-navigator-container">
            {props.pages.map((item, index) => <div key={index} className="tkey-page-details">{item}</div>)}
        </div>
    )
}

export default Navigation;