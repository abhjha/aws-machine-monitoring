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
                        <div className="target-setpoint-label">Target: 50:50 </div>
                        </div>
                    </div>
                    <div className="actual-measurement">Actual % : {this.props.hopperMixBlue } : {100 - this.props.hopperMixBlue} <br/> Setpoint:{this.props.hoppermixLabel} </div>
                </div>
        )
    }
}
export default MixRatio;
