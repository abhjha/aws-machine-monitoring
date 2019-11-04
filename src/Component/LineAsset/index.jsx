import React, { useState , Component} from 'react';
import './index.css';

class LineAsset extends Component {
    
    getBackgroundColor = (data) => {
        console.log(data, "background-color");
        for(let i=0;i<data.alarms.length;i++){
            if(data.alarms[i].SEVERITY == "Alert"){
                return "#EE423D";
                break;
            }else{
                return "orange";
            }
        }
    }
    render() {
        console.log(this.props , "lineassetprops");
        return (
            
            <div className="line-asset-container">
                
            <div className="asset-heading-container">
                <div className="asset-heading">
                    Bin
                </div>
                <div className="asset-heading">
                    Hopper
                </div>
                <div className="asset-heading">
                    Blender
                </div>
                {/* <div className="asset-heading">
                    Finished Goods
                </div> */}
                {/* {this.props.data.children.map(item => <div className="asset-heading">{item.GUID}</div> )} */}

            </div>
            <div className="asset-container"> 
            {this.props.data.children.map(item => 
                <div className="line-asset" 
                    data-id={item.GUID} 
                    onClick={(e)=>this.props.navigateAsset(e)}
                    >
                    <div className="bin-asset" style={{backgroundColor : this.getBackgroundColor(item)}}>
                    </div>
                </div>
            )}
            </div>
        </div>
        )
    }
}
export default LineAsset;