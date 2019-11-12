import React, { useState } from 'react';

function Dropdown (props){
    const [showDropdown, setDropdownStatus] = useState('');

    const toggleDropdown = () => {
        if(showDropdown === ''){
            setDropdownStatus('show');
        }else{
            setDropdownStatus('');
        }
    }

    return (
        <div className="tkey-dropdown"> {props.dropdownselectedValue ? props.dropdownselectedValue : "Select"} <i onClick={toggleDropdown} className="arrow down"></i>
            <div className={"dropdown-options-container "+ showDropdown } onClick={toggleDropdown} > 
                {props.options.map((item,index) => (<div className="dropdown-options" key={index} data-value={item} onClick={(e)=> props.setDropdownSelectedValue(e)}> 
                    {item} 
                </div>))}
            </div>
        </div>
    )
}
export default Dropdown;
