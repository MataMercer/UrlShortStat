import React from 'react';
import {Col, Card, Collapse, Container, ListGroup, Button, Row ,Spinner} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import {connect} from 'react-redux';
import {getUrls, deleteUrl} from '../actions/urlActions';
import PropTypes from 'prop-types';

import Chart from 'chart.js';
import axios from 'axios';
import {CopyToClipboard} from 'react-copy-to-clipboard';
axios.defaults.withCredentials = true; 
var moment = require('moment');



class UrlListItem extends React.Component {
    chartRef = React.createRef();
    chart = null;
    constructor(props) {
        super(props);
        
      }
    state = {
        isOpen: false,
        loading: false,
        copied: false
    }


    toggle = (e) =>{
        this.setState({isOpen: !this.state.isOpen}, () => {

            this.setState({loading: true});
            if(this.state.isOpen){
                axios
                .get('http://localhost:5000/api/url/analytics/' + this.props.url.code)
                .then(res =>{
                    this.setState({loading: false});
                    
                    let monthVisits = res.data.monthVisits;
                    console.log(monthVisits);
                    let data = [];
                    for (let key in monthVisits) {
                        data.push({
                            x: key,
                            y: monthVisits[key]
                        })
                    }
                
                    this.chart.data.datasets.forEach((dataset) => {
                        dataset.data.pop();
                        dataset.data = data;
                    });
                    this.chart.update();
                    
                })
                .catch(error =>{
                    console.log(error.response);
                    this.setState({loading: false});
                });
            }

        });
    }

    componentDidMount(){
        
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
                            unitStepSize: 2,
                            displayFormats: {
                            'day': 'MMM DD'
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

    onDeleteClick = (e) => {
        e.stopPropagation();
        this.props.deleteUrl(this.props.url.code);
    }


    render(){
        const code = this.props.url.code;
        const originalUrl = this.props.url.originalUrl;
        
        const fullUrl = 'http://localhost:5000/u/' + code;
        
        return(
            <Container>
                <Card onClick={this.toggle.bind(this)}>
                    <Col>
                    <Row>
                    

                    <Col >
                            <Button
                                className="remove-btn float-right"
                                color="danger"
                                size="small"
                                onClick={this.onDeleteClick.bind(this)} 
                            >
                            <i className="fas fa-trash"></i>
                        </Button>
                    </Col>
                    </Row>
                    
                    <Row>
                    
                    <Col>
                    <h4>{fullUrl.length>100 && !this.state.isOpen ? fullUrl.slice(-(fullUrl.length), 50) + '...' : fullUrl}
                    
                    <CopyToClipboard text={fullUrl}
                        
                        onCopy={() => {
                            this.setState({copied: true})}}>
                        <Button size="sm" onClick={(e) => {e.stopPropagation();}}>
                            {this.state.copied ? <span>Copied!</span> : <span><i className="fas fa-copy"></i></span>}
                        </Button>
                    </CopyToClipboard>
                    </h4>
                    </Col>
                    </Row>

                    <p>{originalUrl.length>100 && !this.state.isOpen ? originalUrl.slice(-(originalUrl.length), 50) + '...' : originalUrl}</p>
                    
                    
                    <Collapse isOpen={this.state.isOpen}>
                        
                            {this.state.loading ? <Spinner/> : ''}
                            <div onClick={(e) => {e.stopPropagation();}}>
                            <canvas
                                id="myChart"
                                ref={this.chartRef}
                            />
                            </div>
                            
                        
                    </Collapse>
                    
                    </Col>
                    </Card>      
            </Container>
        );
    }

}

UrlListItem.propTypes = {
}

const mapStateToProps = (state) => ({
    loading: state.url.loading,
});


export default connect(
    mapStateToProps, 
    {
        deleteUrl
    }
    )(UrlListItem);