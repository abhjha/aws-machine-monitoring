
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
                  fontColor: 'white',
                  fontSize: 20,
                  fill:true,
                  backgroundColor : 'white'
                },
                fill : true
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
          labelString:"Current(amps)",
                    fontSize: 16,
                    fontColor: 'white',
                  },
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    stepSize: 5,
                    lineWidth: 1,
                    fontColor: 'white',
                    fontSize: 16,
                  },
                  gridLines: {
                    color: 'white',
                    drawTicks: true,
                  }
                }],
                xAxes: [{
                  gridLines: {
                    borderDash: [6, 4],
                    zeroLineBorderDash: [6, 4],
                    color: "white",
                    drawTicks: true,
                  },
                  scaleLabel:{
                    display: true,
          labelString:"Time(s)",
                    fontSize: 16,
                    fontColor: 'white',
                  },
                  ticks: {
                    fontColor: 'white',
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