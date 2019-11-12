import React, {Component} from 'react';
class MixRatio extends Component {

    render() {
        console.log(this.props.hopperMixBlue , "%");
        return (
                <div className="mix-ratio-box">
                    <div className="mix-ratio-heading">Mix Ratio</div>
                    <div className="comparison">Sealant : Dye</div>
                    <div className="target-setpoint">
                        <div className="green-box">
                        <div className= "blue-box" style={{height:this.props.hopperMixBlue+'%'}}></div>
                        <div className="target-setpoint-label">Setpoint:{this.props.hoppermixLabel} </div>
                        <div className="target-setpoint-label">Target: </div>
                        </div>
                    </div>
                    <div className="actual-measurement">Actual % : {this.props.hopperMixBlue } : {100 - this.props.hopperMixBlue}</div>
                </div>
        )
    }
}
export default MixRatio;
