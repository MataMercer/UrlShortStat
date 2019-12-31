import React from 'react';
import {Col, 
    Card,  
    Collapse, 
    Container, 
    FormGroup, 
    Label, 
    Input, 
    ListGroup, 
    Button, 
    Row ,
    Spinner} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import {connect} from 'react-redux';
import {getUrls, deleteUrl} from '../actions/urlActions';
import PropTypes from 'prop-types';

import Chart from 'chart.js';
import axios from 'axios';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import config from './../config/config';
import UrlAnalytics from './UrlAnalytics';
axios.defaults.withCredentials = true; 
var moment = require('moment');



class UrlListItem extends React.Component {

    constructor(props) {
        super(props);
      }
    state = {
        isOpen: false,
        loading: false,
        copied: false,
        timeSpan: 'last30days',
        unitsBackInTime: 0
    }

    onChange = async (e) => {
        e.stopPropagation();
        this.setState({[e.target.name]: e.target.value});
    }

    toggle = (e) =>{
        this.setState({isOpen: !this.state.isOpen} 
            // async () => {

            // if(this.state.isOpen){
            //     this.initChart();
            //     const data = await this.getAnalytics();

            //     this.chart.data.datasets.forEach((dataset) => {
            //         dataset.data.pop();
            //         dataset.data = data;
            //     });
            //     this.chart.update();
               
            // }

        // }
        );
    }

    onDeleteClick = (e) => {
        e.stopPropagation();
        this.props.deleteUrl(this.props.url.code);
    }

    onEditClick = (e) => {
        e.stopPropagation();
        this.props.onToggleEditUrlForm();
    }


    render(){
        const code = this.props.url.code;
        const originalUrl = this.props.url.originalUrl;
        const fullUrl = config.serverUrl + '/u/' + code;

        return(
            <Container>
                <div onClick={this.toggle.bind(this)} className="url-list-item">
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

                            <Button
                                className="remove-btn float-right"
                                size="small"
                                onClick={this.onEditClick.bind(this)} 
                            >
                                <i className="fas fa-edit"></i>
                            </Button>
                    </Col>
                    </Row>
                    
                    <Row>
                    
                    <Col>
                    <h4>{fullUrl.length>100 && !this.state.isOpen ? fullUrl.slice(-(fullUrl.length), 50) + '...' : fullUrl}
                    
                    <CopyToClipboard text={fullUrl}
                        
                        onCopy={() => {
                            this.setState({copied: true})}}>
                        <Button size="sm" onClick={(e) => {e.stopPropagation();}} className="copy-button">
                            {this.state.copied ? <span>Copied!</span> : <span><i className="fas fa-copy"></i></span>}
                        </Button>
                    </CopyToClipboard>
                    </h4>
                    </Col>
                    </Row>

                    <p>{originalUrl.length>100 && !this.state.isOpen ? originalUrl.slice(-(originalUrl.length), 50) + '...' : originalUrl}</p>
                    
                    
                    
                    
                    </Col>
                   
                    </div>
                    <Collapse isOpen={this.state.isOpen} className="url-list-item-analytics-section">

                    <FormGroup>
                        <Label for="timeSpan">Time Period</Label>
                        <Input type="select" name="timeSpan" onChange={this.onChange}>
                        <option value="last30days">Last 30 days</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                        <option value="eachyear">Each Year</option>
                        </Input>
                        
                        <Label for="unitsBackInTime">Units Back in Time</Label>
                        <Input name="unitsBackInTime" value={this.state.unitsBackInTime} disabled={this.state.timeSpan==='last30days'} onChange={this.onChange} type="number" min="0" max="100"></Input>
                    </FormGroup>

                    <Row><Col><h4>Visits</h4></Col></Row>
                        <Row>
                            
                        
                    </Row>
                    <p>{this.state.timeSpan}</p>
                            
                               
                        <UrlAnalytics timeSpan={this.state.timeSpan} code={code} unitsBackInTime={this.state.unitsBackInTime}></UrlAnalytics>
                        
                    </Collapse>
                    
                    
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