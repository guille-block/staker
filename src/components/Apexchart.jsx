import React, { Component } from "react";
import Chart from "react-apexcharts";

class LineGraph extends Component {

    /*componentDidMount = async () => {
        this.setState(prevState => ({
            options: {
              ...prevState.options,          
              xaxis: {                     
                ...prevState.options.xaxis,   
                categories: this.props.dateArr         
            }
            }
          }))
      }*/

    constructor(props) {
      super(props);
  
      this.state = {
        options: {
          chart: {
            id: "basic-line"
          },
          xaxis: {
            categories: this.props.dateArr
          },
          yaxis: {
            labels: {
              formatter: function(val, index) {
                return val.toFixed(0);
              }
            }
          },
          tooltip: {
            y: {
              formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                return value
              }
            }
          }
        },
        series: [
          {
            name: "series-1",
            data: this.props.intArr
          }
        ]
      };
    }
        render () {
        return (
          <div className="app">
            <div className="row">
              <div className="mixed-chart" key={this.props.key}>
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  type="line"
                  width="1100"
                  height = "500"
                />
              </div>
            </div>
          </div>
        )
        }
      }

  export default LineGraph;