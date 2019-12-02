import React, {Component} from 'react';
class MixRatio extends Component {

    render() {
        const marginValue = 'calc(' + ((100-this.props.hopperMix) + '%') + ' - 10px)';
        return (
                <div className="mix-ratio-box">
                    <div className="mix-ratio-heading">Mix Ratio</div>
                    <div className="comparison">Blue:Green </div>
                    <div className="target-setpoint">
                        <div className="green-box">
                        <div className="target-marker" style={{"top":(100 - this.props.hopperMix)+'%'}}></div>
                        <div className= "blue-box" style={{height:(100 - this.props.hopperActual)+'%'}}></div>
                       
                        <div className="target-setpoint-label" style={{"top":marginValue}}>Target: {this.props.hopperMix}:{100-this.props.hopperMix}</div>
                        
                        </div>
                    </div>
                    <div className="actual-measurement">Actual: {this.props.hopperActual}:{100-this.props.hopperActual } <br/> Setpoint: {this.props.hopperSetpoint +"%"} </div>
                </div>
        )
    }
}
export default MixRatio;
