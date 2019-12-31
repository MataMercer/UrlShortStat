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
            unitsBackInTime: this.props.unitsBackInTime
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
            switch(this.props.timeSpan){
                case 'month':
                   lowerBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - this.props.unitsBackInTime, 1); // first dday of month
                   upperBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - this.props.unitsBackInTime + 1, 0);//first of next month
                   format = "MM/DD/YYYY";
                   let date = new Date(upperBoundDate.getFullYear(), upperBoundDate.getMonth(), upperBoundDate.getDate());
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
                    format = "MM/YYYY";
                    break; 
                case 'eachyear':
                    upperBoundDate = currentDate;
                    lowerBoundDate = new Date(currentDate.getFullYear() + 1 - this.props.unitsBackInTime, 0, 1); //earliest is 20 years ago
                    format = "YYYY";



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
         
            return data;
        
            
        })
        .catch(error =>{
            console.log(error.response);
            return null;
        });

    }
     

    initChart(){
        const myChartRef = this.chartRef.current.getContext("2d");
        var timeFormat = 'MM/DD/YYYY';

		function newDate(days) {
			return moment().subtract(days, 'd').toDate();
		}

		function newDateString(days) {
			return moment().subtract(days, 'd').format(timeFormat);
        }
        
        function psqlToDate(psqlDate){
            return moment(psqlDate).format(timeFormat);
        }
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
                        type: 'time',
                        time: {
                            unit: 'day',
                            unitStepSize: 1,
                            displayFormats: {
                            'day': 'MM/DD/YY'
                            }
                        }
                    }],
                    yAxes: [{
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
            const analytics = await this.getAnalytics();
            console.log(analytics);
            this.chart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
                dataset.data = analytics;
            });
            this.chart.update();
        }
    }


    componentDidMount(){
        this.initChart()


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
                    <h4>{this.props.timeSpan}</h4>
                        <div onClick={(e) => {e.stopPropagation();}} >
                        
                        <canvas
                            id="myChart"
                            ref={this.chartRef}
                        />
                        </div>
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