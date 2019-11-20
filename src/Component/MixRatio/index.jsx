import React, {Component} from 'react';
class MixRatio extends Component {

    render() {
        const marginValue = 'calc(' + ((100-this.props.hopperMixBlue) + '%') + ' - 10px)';
        return (
                <div className="mix-ratio-box">
                    <div className="mix-ratio-heading">Mix Ratio</div>
                    <div className="comparison">Green : Blue</div>
                    <div className="target-setpoint">
                        <div className="green-box">
                        <div className="target-marker" style={{"top":(100 - this.props.hopperMixBlue)+'%'}}></div>
                        <div className= "blue-box" style={{height:(100 - this.props.hopperMixBlueActual)+'%'}}></div>
                       
                        <div className="target-setpoint-label" style={{"top":marginValue}}>Target: {this.props.hopperMixBlue}:{100-this.props.hopperMixBlue} </div>
                        
                        </div>
                    </div>
                    <div className="actual-measurement">Actual: {this.props.hopperMixBlueActual }:{100 - this.props.hopperMixBlueActual} <br/> Setpoint: {this.props.hoppermixLabel +"%"} </div>
                </div>
        )
    }
}
export default MixRatio;
