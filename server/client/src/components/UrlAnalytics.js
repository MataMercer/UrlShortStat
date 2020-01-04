import React from 'react';
import {Col, 

    Container, 
    FormGroup, 
    Label, 
    Input, 
    ListGroup, 
    Button, 
    Row ,
    Spinner} from 'reactstrap';
import {connect} from 'react-redux';
import Chart from 'chart.js';
import axios from 'axios';
import config from './../config/config';
axios.defaults.withCredentials = true; 
var moment = require('moment');



class UrlAnalytics extends React.Component {
    chartRef = React.createRef();
    chart = null;
    constructor(props) {
        super(props);
      }
    state = {
        loading: false,
    }


    getAnalytics(){
        const body = {
            code: this.props.code,
            timeSpan: this.props.timeSpan,
            unitsBackInTime: this.props.unitsBackInTime,
            timeSpanVisitCount: 0,
            totalVisitCount: 0
        }
        return axios
        .post(config.serverUrl + '/api/url/analytics/', body)
        .then(res =>{
            // this.setState({loading: false});
            
            //change the format of the response to match the format for plotting on chartjs
            let dataPointsRes = res.data.dataPoints;
            let dataPoints = {};

            //fill data with 0s
            let lowerBoundDate = null;
            let upperBoundDate = null;
            let format = null;
            const currentDate = new Date();
            let date = null;
            switch(this.props.timeSpan){
                case 'month':
                   lowerBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - this.props.unitsBackInTime, 1); // first dday of month
                   upperBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - this.props.unitsBackInTime + 1, 0);//first of next month
                   format = "MM/DD/YYYY";
                   date = new Date(upperBoundDate.getFullYear(), upperBoundDate.getMonth(), upperBoundDate.getDate());
                   for(let i = 0; date > lowerBoundDate; i++){
                    date = new Date(upperBoundDate.getFullYear(), upperBoundDate.getMonth(), upperBoundDate.getDate()-i);
                    const formattedDate = moment(date).format(format).toString();
                    
                    if(!(formattedDate in dataPointsRes)){
                        dataPoints[formattedDate] = 0;
                    }else{
                        dataPoints[formattedDate] = dataPointsRes[formattedDate];
                    }
                    }
                    

                   break;
                case 'year':
                    lowerBoundDate = new Date(currentDate.getFullYear() - this.props.unitsBackInTime, 0, 1);
                    upperBoundDate = new Date(currentDate.getFullYear() + 1 - this.props.unitsBackInTime, 0, 0);
                    //even though the units is by month, chartjs wants the day to be included for some reason. chartjs will not read MM/YYYY, only MM/DD/YYYY. 
                    format = "MM/DD/YYYY";
                    date = new Date(upperBoundDate.getFullYear(), upperBoundDate.getMonth());
                    for(let i = 0; date > lowerBoundDate; i++){
                        date = new Date(upperBoundDate.getFullYear(), upperBoundDate.getMonth()-i);
                        const formattedDate = moment(date).format(format).toString();
                        //the server still goes by this format in its response. MM/YYYY
                        const resFormattedDate = moment(date).format('MM/YYYY').toString();
                        if(!(resFormattedDate in dataPointsRes)){
                            dataPoints[formattedDate] = 0;
                        }else{
                            dataPoints[formattedDate] = dataPointsRes[resFormattedDate];
                        }
                    }

                    break; 
                default:
                    //last 30 days
                    upperBoundDate = currentDate;
                    lowerBoundDate = new Date(upperBoundDate.getFullYear(), upperBoundDate.getMonth(), upperBoundDate.getDate()-30);
                    format = "MM/DD/YYYY";
                    
                    for(let i = 0; i < 30; i++){
                        const date = new Date(upperBoundDate.getFullYear(), upperBoundDate.getMonth(), upperBoundDate.getDate()-i);
                        const formattedDate = moment(date).format(format).toString();
                        
                        if(!(formattedDate in dataPointsRes)){
                            dataPoints[formattedDate] = 0;
                        }else{
                            dataPoints[formattedDate] = dataPointsRes[formattedDate];
                        }
                    }
                    
            }

            
            
            
            let data = [];
            for (let key in dataPoints) {
                data.push({
                    x: key,
                    y: dataPoints[key]
                })
            }
         
            return {data, totalVisitCount: res.data.totalVisitCount, timeSpanVisitCount: res.data.timeSpanVisitCount};
        
            
        })
        .catch(error =>{
            console.log(error.response);
            return null;
        });

    }
    
    getXAxisLabel(){
        switch(this.props.timeSpan){
            case 'month':
                return 'Days'
            case 'year':
                return 'Months'
            default:
                return 'Days'
        }
    }

    getUnits(){
        
        switch(this.props.timeSpan){
            case 'month':
                return 'day'
            case 'year':
                return 'month'
            default:
                return 'day'
        }
    }

    initChart(){
        const myChartRef = this.chartRef.current.getContext("2d");

        // var color = Chart.helpers.color;
        const lineColor = '#69cfff';
        var config = {
            type: 'line',
			data: {

				datasets: [{
                    label: 'Visits',
                    backgroundColor: lineColor,
                    borderColor: lineColor,
					fill: false,
					data: [

					],
				}]
            },
            options: {
                
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: this.getXAxisLabel()
                          },
                        type: 'time',
                        time: {
                            unit: 'day',
                            unitStepSize: 1,
                            displayFormats: {
                            'day': 'MMM DD YY'
                            }
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Visits'
                          },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
			
		};
        this.chart = new Chart(myChartRef, config);

    }

 

    async updateData(){

        if(this.chart){
            this.chart.options.title = {
                text: 'Visits',
                display: true
            };

            this.chart.options.scales = {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: this.getXAxisLabel()
                      },
                    type: 'time',
                    time: {
                        unit: this.getUnits(),
                        unitStepSize: 1,
                        displayFormats: {
                        day: 'MMM DD, YYYY',
                        month: 'MMM YYYY'
                        }
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Visits'
                      },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            };

            const analytics = await this.getAnalytics();
            console.log(analytics);
            this.chart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
                dataset.data = analytics.data;
            });
            this.chart.update();
            // this.setState({timeSpanVisitCount:analytics.timeSpanVisitCount, totalVisitCount: analytics.totalVisitCount})
        }
    }


    componentDidMount(){
        this.initChart();
        this.updateData();

    }

    async componentDidUpdate(){
        this.updateData();
    }

    

    render(){
        return(
                    <Row>
                    <Col>
                        <div onClick={(e) => {e.stopPropagation();}} >
                        
                        <canvas
                            id="myChart"
                            ref={this.chartRef}
                        />
                        </div>

                        {this.state.totalVisitCount}
                    </Col>
                    </Row>
                    
         
        );
    }
}

UrlAnalytics.propTypes = {
}

const mapStateToProps = (state) => ({
    loading: state.url.loading,
});


export default connect(
    mapStateToProps, 
    {}
    )(UrlAnalytics);