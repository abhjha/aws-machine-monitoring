
import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.data
    }
  }

  render() {
    console.log(this.state.chartData);

    return (
      <div className="chart">
        <div className="hopper-rate-heading">{this.props.chartHeader}</div>
        <div className="line-charts">
          <Line
            data={this.props.data}
            options={{
              legend: {
                position: 'top',
                
                labels: {
                  boxWidth: 29,
                  fontColor: 'white',
                  fontSize: 10,
                  usePointStyle :true
                },
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: "Current (amps)",
                    fontSize: 16,
                    fontColor: 'white',
                  },
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 1,
                    stepSize: 0.2,
                    lineWidth: 1,
                    fontColor: 'white',
                    fontSize: 12,
                  },
                  gridLines: {
                    color: 'transparent',
                    drawTicks: false,
                  }
                }],
                xAxes: [{
                  gridLines: {
                    borderDash: [6, 4],
                    zeroLineBorderDash: [6, 4],
                    color: "gray",
                    drawTicks: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Time (s)",
                    fontSize: 16,
                    fontColor: 'white',
                  },
                  ticks: {
                    fontColor: 'white',
                    fontSize: 8,
                    stepSize : 60,
                    min : -60,
                    max: 0

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