
import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import './index.css';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.data
    }
  }

  render() {
    return (
      <div className="chart">
        <div className="hopper-rate-heading">{this.props.chartHeader}</div>
        <div className="line-charts">
          <Line
            data={this.state.chartData}
            options={{
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 29,
                  fontColor: 'white',
                  fontSize: 20
                }
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  label: "Current(amps)",
                  scaleLabel: {
                    display: true,
                    fontSize: 16,
                    fontColor: '#98A7B9',
                  },
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    stepSize: 5,
                    lineWidth: 1,
                    fontColor: '#98A7B9',
                    fontSize: 16,
                  },
                  gridLines: {
                    color: '#242E42',
                    drawTicks: false,
                  }
                }],
                xAxes: [{
                  gridLines: {
                    borderDash: [6, 4],
                    zeroLineBorderDash: [6, 4],
                    color: "#242E42",
                    drawTicks: false
                  },
                  ticks: {
                    fontColor: '#98A7B9',
                    fontSize: 16,
                    padding: 10.5
                  }
                }
                ]
              }
            }} />
        </div>
      </div>
    )
  }
}



export default Chart;