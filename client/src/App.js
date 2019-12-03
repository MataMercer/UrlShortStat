import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import AppNavbar from './components/AppNavbar';
import Routes from './routes/Routes';
import {connect} from 'react-redux';

import {checkUserSession} from './actions/userActions';
import {Spinner} from 'reactstrap';


class App extends React.Component{
  componentDidMount(){
    this.props.checkUserSession();
  }

  render(){
    return (
      
        <div className="App">
          <header className="App-header">
            <AppNavbar/>
            {this.props.loading ? <Spinner/> : <Routes/>}
            
          </header>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.user.loading
});

export default connect(mapStateToProps, {checkUserSession})(App);
