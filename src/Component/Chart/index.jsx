
import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.data
    }
  }

  render()
   {
    console.log(this.state.chartData);

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
                  fontColor: 'black',
                  fontSize: 20,
                  fill:true,
                  backgroundColor : 'black'
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
                    fontColor: 'black',
                  },
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    stepSize: 5,
                    lineWidth: 1,
                    fontColor: 'black',
                    fontSize: 16,
                  },
                  gridLines: {
                    color: 'black',
                    drawTicks: true,
                  }
                }],
                xAxes: [{
                  gridLines: {
                    borderDash: [6, 4],
                    zeroLineBorderDash: [6, 4],
                    color: "black",
                    drawTicks: true,
                  },
                  ticks: {
                    fontColor: 'black',
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