import React, {  Component } from 'react';
import LineAssetData from '../LineAssetContainer/index';

class LineAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineAsset: ["Raw Material Bins", "Mixing Unit", "Paint Machine","Quality Inspection"],
            // binData: [],
            // mixingUnitData: [],
            // paintMachineData: [],
            // lineData: [],
            // finishedGoods :[]

        }
    }
    // sortLineData = (data) => {
        
    //     for (let i = 0; i < data.children.length; i++) {
    //         if (data.children[i].ASSET_TYPE == "Bin") {
    //             this.state.binData.push(data.children[i]);
    //         } else if (data.children[i].ASSET_TYPE == "Blender") {
    //             this.state.paintMachineData.push(data.children[i]);
    //         } else if (data.children[i].ASSET_TYPE == "Hopper") {
    //             this.state.mixingUnitData.push(data.children[i]);
    //         } else if (data.children[i].ASSET_TYPE == "Finished Goods") {
    //             this.state.finishedGoods.push(data.children[i]);
    //         }
    //     }
    //     this.setState({
    //         lineData: [this.state.binData, this.state.mixingUnitData, this.state.paintMachineData , this.state.finishedGoods],
    //     })


    // }
    // getBackgroundColor = (data) => {
    //     console.log(data, "background-color");
    //     var alertCount = 0;
    //     var warningCount = 0;
    //     if (data.length > 0) {
    //         for (let i = 0; i < data.length; i++) {
    //             for (let j = 0; j < data[i].alarms.length; j++) {
    //                 if (data[i].alarms[j].SEVERITY == "Alert") {
    //                     alertCount++;
    //                 } else if (data[i].alarms[j].SEVERITY == "Warning") {
    //                     warningCount++;
    //                 }
    //             }
    //         }
    //         if (alertCount > 0) {
    //             return "#EE423D";
    //         } else if (warningCount > 0) {
    //             return "orange";
    //         }
    //     } else {
    //         return "gray";
    //     }

    // }

    
    render() {
        console.log(this.state.lineData);
        return (

            <div className="line-asset-container">

                <div className="asset-heading-container">
                    {/* <div className="asset-heading">
                    Raw Material Bins
                </div>
                <div className="asset-heading">
                    Mixing Unit
                </div>
                <div className="asset-heading">
                    Paint Machine
                </div> */}
                    {/* <div className="asset-heading">
                    Finished Goods
                </div> */}
                    {this.state.lineAsset.map(item => <div className="asset-heading">{item}</div>)}

                </div>
                <LineAssetData data={this.props.data} navigateAsset={this.props.navigateAsset}/>
            </div>
        )
    }
}
export default LineAsset;