import React, { useState } from 'react';
import './index.css';
function Button (props){
    return (
            <button className={"tkey-button" + (props.type==="reset" ? ' reset' : '')} onClick={props.triggerAction}>{props.labelName}</button>
    )
}
export default Button;