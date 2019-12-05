import React from 'react';
// import logo from './logo.svg';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';


import AppNavbar from './components/AppNavbar';
import Routes from './routes/Routes';
import {connect} from 'react-redux';

import {checkUserSession} from './actions/userActions';
import {Spinner, Container} from 'reactstrap';

import 'axios-progress-bar/dist/nprogress.css'
import { loadProgressBar } from 'axios-progress-bar'


class App extends React.Component{
  componentDidMount(){
    this.props.checkUserSession();
  }

  render(){
    return (
        
        <div className="App">
        {loadProgressBar({ showSpinner: false })}
            <AppNavbar/>
            {this.props.loading ? 
              <Spinner/> 
              : 
              <Container className="page-content"><Routes/></Container>}
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.user.loading
});

export default connect(mapStateToProps, {checkUserSession})(App);
