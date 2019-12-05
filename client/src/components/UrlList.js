import React from 'react';
import {Card, Container, ListGroup, Button, Row ,Spinner} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import {connect} from 'react-redux';
import {getUrls, deleteUrl} from '../actions/urlActions';
import CreateUrlForm from './CreateUrlForm';
import PropTypes from 'prop-types';

class UrlList extends React.Component {
    state = {
        showCreateUrlForm: false
    }

    componentDidMount(){
        this.props.getUrls();
        
    }

    onDeleteClick = (urlCode) => {
        this.props.deleteUrl(urlCode);
    }

    onToggleCreateUrlForm = () =>{
        this.setState({showCreateUrlForm: !this.state.showCreateUrlForm});
    }

    render(){
        const urls = this.props.urls;
        const hostUrl = 'http://localhost:5000/u/';
        
        return(
            <Container>
                <h1>Your URLs</h1>
                <h4>{this.props.urlCount} URL{this.props.urlCount === 1 ? '' : 's'}</h4>

                <Button
                onClick={this.onToggleCreateUrlForm.bind(this)}
                >{
                    this.state.showCreateUrlForm ? 
                        'Close'
                    :
                    'Shorten a new URL'
                }</Button>
                
                {
                    this.state.showCreateUrlForm ? 
                        <CreateUrlForm/>
                    :
                    ""
                }

                



                {this.props.loading ?
                    <Spinner/>
                    :
                    <ListGroup>
                    
                    {urls.map(({urlCode, originalUrl}) => (
                        <Card>
                        
                            <p>{hostUrl + urlCode}</p>
                            <p>{originalUrl.length>100 ? originalUrl.slice(-(originalUrl.length), 100) + '...' : originalUrl}</p>
                            <Button
                                className="remove-btn"
                                color="danger"
                                size="small"
                                onClick={this.onDeleteClick.bind(this, urlCode)} 
                                >
                                X
                            </Button>
                        
                            </Card>
                    ))}
                    
                    </ListGroup>        
                }
                
                
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
        getUrls, deleteUrl
    }
    )(UrlList);