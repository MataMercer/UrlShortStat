import React from 'react';
import {Col, Card, Container, ListGroup, Button, Row ,Spinner} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import {connect} from 'react-redux';
import {getUrls} from '../actions/urlActions';
import CreateUrlForm from './CreateUrlForm';
import EditUrlForm from './EditUrlForm';
import PropTypes from 'prop-types';
import UrlListItem from './UrlListItem';

class UrlList extends React.Component {
    state = {
        showCreateUrlForm: false,
        showEditUrlForm: false,
        editingUrlCode: null
    }

    componentDidMount(){
        this.props.getUrls();
        
    }

    onToggleCreateUrlForm = () =>{
        this.setState({showCreateUrlForm: !this.state.showCreateUrlForm});
    }

    onToggleEditUrlForm = () => {
        this.setState({showEditUrlForm: !this.state.showEditUrlForm})
    }

    setEditingUrlCode(code){
        this.setState({editingUrlCode: code})
    }


    render(){
        const urls = this.props.urls;
        const hostUrl = 'http://localhost:5000/u/';
        

        

        return(
            <Container>
                <Col>
                <h1>Your URLs</h1>
                <hr/>
                <h4>{this.props.urlCount} URL{this.props.urlCount === 1 ? '' : 's'}</h4>

                <Button
                onClick={this.onToggleCreateUrlForm.bind(this)}
                color="primary"
                >
                <i className="fas fa-plus"></i>
                {
                    ' Shorten a new URL'
                }</Button>
                
                {
                    this.state.showCreateUrlForm ? 
                        <CreateUrlForm showCreateUrlForm={this.state.showCreateUrlForm} onToggleCreateUrlForm={this.onToggleCreateUrlForm.bind(this)}/>
                    :
                    ""
                }

                {
                    this.state.showEditUrlForm ? 
                        <EditUrlForm showEditUrlForm={this.state.showEditUrlForm} onToggleEditUrlForm={this.onToggleEditUrlForm.bind(this)} code={this.state.editingUrlCode}/>
                    :
                    ""
                }

                



                {this.props.loading ?
                    <Spinner/>
                    :
                    <ListGroup>
                    
                    {urls.map((url) => (
                        <Row key={url.code}><UrlListItem url={url} onToggleEditUrlForm={this.onToggleEditUrlForm.bind(this)} setEditingUrlCode={this.setEditingUrlCode.bind(this)}/></Row>
                    ))}
                    
                    </ListGroup>        
                }
                
                </Col>
            </Container>
        );
    }

}

UrlList.propTypes = {
    getUrls: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    urls: state.url.urls,
    loading: state.url.loading,
    urlCount: state.url.urlCount
});


export default connect(
    mapStateToProps, 
    {
        getUrls
    }
    )(UrlList);