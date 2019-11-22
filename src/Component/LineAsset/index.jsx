import React, {  Component } from 'react';
import LineAssetData from '../LineAssetContainer/index';

class LineAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineAsset: ["Bin", "Hopper", "Blender","Finished Goods"],

        }
    }
    
    render() {
        return (

            <div className="line-asset-container">

                <div className="asset-heading-container">
                    {/* <div className="asset-heading">
                    Bin
                </div>
                <div className="asset-heading">
                    Hopper
                </div>
                <div className="asset-heading">
                    Blender
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