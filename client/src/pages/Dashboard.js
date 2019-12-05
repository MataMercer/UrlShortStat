import React from 'react';
import {
    Container,
    Jumbotron,
    Button
} from 'reactstrap';


import UrlList from '../components/UrlList';
class Dashboard extends React.Component{


    render(){
        return(
            <Container>
            <UrlList/>
            </Container>
        );
    }
}

export default Dashboard;