import React, { useState , Component} from 'react';
import './index.css';


class PlantAsset extends Component {
    getBackgroundColor = (data) => {
        var alertCount =0;
        var warningCount = 0;
        for(let i=0;i<data.alarms.length;i++){
            if(data.alarms[i].SEVERITY == "Alert"){
                alertCount++;
            }else if(data.alarms[i].SEVERITY == "Warning"){
                warningCount++;
            }
        }
        if(alertCount>0){
            return "#EE423D";
        }else if(alertCount == 0 && warningCount >0){
            return "orange";
        }else{
            return "#05C985"
        }
    }
    render() {
        return (
            <div className="plant-asset-container">
            <div className="plant-asset-heading-container">
                <div className="plant-asset-heading">
                    
                </div>
                <div className="plant-asset-heading">
                Raw Material Bin
                </div>
                <div className="plant-asset-heading">
                Mixing Unit
                </div>
                <div className="plant-asset-heading">
                    Paint Machine
                </div>
                
                {/* {this.props.data.children.map(item => item.children.map(newItem => <div className="plant-asset-heading"> {newItem.GUID}</div>))} */}

            </div>
            <div className="line-asset-container">{this.props.data.children.map(item=> <div className="line-asset-details" key={item.GUID} data-id={item.GUID}
            onClick={ (e) => this.props.navigateAsset(e)}><div className="line-asset-status line-heading">{item.GUID}</div> { item.children.map( newItem => <div className="line-asset-status"><div className="line-asset-div" style={{backgroundColor:this.getBackgroundColor(newItem)}}></div></div> )}</div>)}</div>
        </div>
        )
    }
}
export default PlantAsset;