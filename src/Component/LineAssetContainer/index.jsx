import React, { Component } from 'react';

class LineAssetData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            binData: [],
            mixingUnitData: [],
            paintMachineData: [],
            lineData: [],
            finishedGoods :[]

        }
    }
    sortLineData = (data) => {
        
        for (let i = 0; data.children != undefined && i < data.children.length; i++) {
            if (data.children[i].ASSET_TYPE == "Bin") {
                this.state.binData.push(data.children[i]);
            } else if (data.children[i].ASSET_TYPE == "Blender") {
                this.state.paintMachineData.push(data.children[i]);
            } else if (data.children[i].ASSET_TYPE == "Hopper") {
                this.state.mixingUnitData.push(data.children[i]);
            } else if (data.children[i].ASSET_TYPE == "Finished Goods") {
                this.state.finishedGoods.push(data.children[i]);
            }
        }
        this.setState({
            lineData: [this.state.binData, this.state.mixingUnitData, this.state.paintMachineData , this.state.finishedGoods],
        })


    }
    getBackgroundColor = (data) => {
        var alertCount = 0;
        var warningCount = 0;
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].alarms.length; j++) {
                    if (data[i].alarms[j].SEVERITY == "Alert") {
                        alertCount++;
                    } else if (data[i].alarms[j].SEVERITY == "Warning") {
                        warningCount++;
                    }
                }
            }
            if (alertCount > 0) {
                return "#EE423D";
            } else if (warningCount > 0) {
                return "orange";
            }
        } else {
            return "gray";
        }

    }

    componentDidMount() {
        this.sortLineData(this.props.data);
    }
    componentWillReceiveProps(){
        this.sortLineData(this.props.data);
    }
    render() {
        return (
                
                <div className="asset-container">
                    {this.state.lineData.map(item =>
                        <div className="line-asset"
                            data-id={item.length > 0 ? item[0].ASSET_TYPE : ""}
                            onClick={(e) => this.props.navigateAsset(e)}
                        >
                            <div className="bin-asset" style={{ backgroundColor: this.getBackgroundColor(item) }}>
                            </div>
                        </div>
                    )}
                </div>
           
        )
    }
}
export default LineAssetData;