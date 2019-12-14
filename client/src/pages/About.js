import React from 'react';
import {
    Container,
    Jumbotron,
    Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
class About extends React.Component{


    render(){
        return(
            <Container>
            <h1>About URLShortStat</h1>
            <p>URL Shortstat is a website.</p>
            </Container>
        );
    }
}

export default About;