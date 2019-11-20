import React from 'react';

function Navigation (props){
    return (
        <div className="tkey-navigator-container">
            {props.pages.map((item, index) => <div key={index} className="tkey-page-details">{item}</div>)}
        </div>
    )
}

export default Navigation;