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
            <h3>URLShortStat is the fastest growing website in the world yet this is under construction. :D</h3>
            </Container>
        );
    }
}

export default About;