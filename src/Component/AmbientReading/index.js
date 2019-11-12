import React from 'react';

class AmbientReadings extends React.Component {
    constructor(props){
        super(props);
        this.state ={
        temp : props.temp,
        humidity: props.humidity,
        pressure: props.pressure

        }
       
    }
    render() {
        return (
            <div className="ambient-box">
                <div className="description-value">
                <div className="description-heading">Description</div>
                <div className="value-heading"><span>Value</span></div>
                
                </div>
                <div className="temperature-humidity-pressure">
                    <div className="temperature">
                    <div className="temp-heading">Ambient Temp.</div>
                    <div className="temp-value"><span>{this.props.temp}</span></div>
                    </div>
                    <div className="humidity">
                    <div className="humid-heading">Humidity</div>
                    <div className="humid-value">{this.props.humidity}</div>
                    </div>
                    <div className="pressure">
                    <div className="pressure-heading">Ambient Pres.</div>
                    <div className="pressure-value">{this.props.pressure}</div>
                    </div>


                </div>

            </div>

        );
    }
}



export default AmbientReadings;