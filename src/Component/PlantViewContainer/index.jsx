import React, { Component} from 'react';
import LineAssetData from '../LineAssetContainer/index';


class PlantAsset extends Component {
    
    // fetchBackgroundColor = (childrenData) =>{
    //     let alertsCount = 0;
    //     let warningsCount = 0;
    //     if(childrenData.alarms.length>0){
    //         for(let i = 0;i<childrenData.alarms.length;i++){
    //             if(childrenData.alarms[i].SEVERITY.toLowerCase() == "alert"){
    //                 alertsCount++;
    //             }else if(childrenData.alarms[i].SEVERITY.toLowerCase() == "warning"){
    //                 warningsCount++;
    //             }
    //         }
    //     }
    //     for(let j=0; childrenData.children != undefined && j < childrenData.children.length ; j++){
    //         for(let k=0;childrenData.children[j].alarms.length != undefined && k < childrenData.children[j].alarms.length ; k++ ){
    //             if(childrenData.children[j].alarms[k].SEVERITY.toLowerCase() == "alert"){
    //                 alertsCount++;
    //             }else if(childrenData.children[j].alarms[k].SEVERITY.toLowerCase() == "warning"){
    //                 warningsCount++;
    //             }
    //         }
    //     }
    //     if(alertsCount ===0 && warningsCount === 0){
    //         childrenData["backGroundColor"] = "green";
    //     }else if(alertsCount>0){
    //         childrenData["backGroundColor"] = "red";
    //     }else if(alertsCount ==0 && warningsCount>0){
    //         childrenData["backGroundColor"] = "yellow";
    //     }

    //     console.log(childrenData,alertsCount,warningsCount);
    //     return childrenData;
    // }
    // componentDidMount() {
    //     for(let i=0;i<this.props.data.children.length; i++){
    //         this.props.data.children[i] = this.fetchBackgroundColor(this.props.data.children[i]);
    //     }
    // }
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
                <div className="plant-asset-heading">
                Quality Inspection
                </div>
                
                
                {/* {this.props.data.children.map(item => item.children.map(newItem => <div className="plant-asset-heading"> {newItem.GUID}</div>))} */}

            </div>
            <div className="line-asset-container">{this.props.data.children.map(item=> 
                <div className="line-asset-details" key={item.GUID} data-id={item.GUID}
                    onClick={ (e) => this.props.navigateAsset(e)}>
                        <div className={"line-asset-status line-heading " + item.backGroundColor} >{item.ASSET_NAME}</div> 
                        <div className="line-asset-data-container"> <LineAssetData data={item} navigateAsset={this.props.navigateAsset}/> </div>
                    </div>)}
                </div>
        </div>
        )
    }
}
export default PlantAsset;