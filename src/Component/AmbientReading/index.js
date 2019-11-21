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
                    <div className="temp-value"><span>{Math.floor(this.props.temp)+ " F"}</span></div>
                    </div>
                    <div className="humidity">
                    <div className="humid-heading">Humidity</div>
                    <div className="humid-value">{Math.floor(this.props.humidity)+ " %"}</div>
                    </div>
                    <div className="pressure">
                    <div className="pressure-heading">Ambient Pres.</div>
                    <div className="pressure-value">{Math.floor(this.props.pressure) + " inHg"}</div>
                    </div>


                </div>

            </div>

        );
    }
}



export default AmbientReadings;