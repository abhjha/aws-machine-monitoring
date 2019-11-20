import React, {Component} from 'react';
class MixRatio extends Component {

    render() {
        return (
                <div className="mix-ratio-box">
                    <div className="mix-ratio-heading">Mix Ratio</div>
                    <div className="comparison">Sealant : Dye</div>
                    <div className="target-setpoint">
                        <div className="green-box">
                        <div className= "blue-box" style={{height:(100 - this.props.hopperMixBlueActual)+'%'}}></div>
                        <div className="target-setpoint-label" style={{"margin-top":(100 - this.props.hopperMixBlueActual)+'%'}}>Target: {this.props.hopperMixBlue}:{100-this.props.hopperMixBlue} </div>
                        <div className="target-marker"></div>
                        </div>
                    </div>
                    <div className="actual-measurement">Actual: {this.props.hopperMixBlueActual }:{100 - this.props.hopperMixBlueActual} <br/> Setpoint: {this.props.hoppermixLabel +"%"} </div>
                </div>
        )
    }
}
export default MixRatio;
