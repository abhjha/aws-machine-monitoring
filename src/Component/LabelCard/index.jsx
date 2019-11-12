import React from 'react';

function LabelCard (props){
    return (
        <div className="label-container card-tile">
            <div className="label-value">
                {(parseFloat(props.value).toFixed(2)*100 + "%")}
            </div>
            <div className="label-heading">
                {props.heading}
            </div>
        </div>
    )
}

export default LabelCard;