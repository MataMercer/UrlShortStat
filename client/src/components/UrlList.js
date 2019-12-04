import React from 'react';
import {Card, Container, ListGroup, Button, Row ,Spinner} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import {connect} from 'react-redux';
import {getUrls, deleteUrl} from '../actions/urlActions';

import PropTypes from 'prop-types';

class UrlList extends React.Component {
    state = {
        showCreateUrlForm = false
    }

    componentDidMount(){
        this.props.getUrls();
        
    }

    onDeleteClick = (urlCode) => {
        this.props.deleteUrl(urlCode);
    }

    render(){
        const urls = this.props.urls;
        const hostUrl = 'http://localhost:5000/u/';
        
        return(
            <Container>
                <h1>Your URLs</h1>

                {
                    this.state.showCreateUrlForm ? 
                    <Card>
                        <h4>Create URL</h4>
                        
                    </Card>
                    :
                    ""
                }



                {this.props.loading ?
                    <Spinner/>
                    :
                    <ListGroup>
                    
                    {urls.map(({urlCode, originalUrl}) => (
                        <Card>
                            <Row>
                                <h3>{hostUrl + urlCode}</h3>
                                <Button
                                    className="remove-btn"
                                    color="danger"
                                    size="small"
                                    onClick={this.onDeleteClick.bind(this, urlCode)} 
                                    >
                                    X
                                </Button>
                            </Row>
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
    loading: state.url.loading
});


export default connect(
    mapStateToProps, 
    {
        getUrls, deleteUrl
    }
    )(UrlList);