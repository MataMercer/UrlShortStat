import React from 'react';
import { Alert, FormGroup, Form, Button, Container, Card, InputGroup, InputGroupAddon, InputGroupText, Input, Label, Spinner } from 'reactstrap';
import {
    BrowserRouter as Router,
    Redirect,
    Link
} from 'react-router-dom'
  

  
import {connect} from 'react-redux';
import {loginUser} from '../actions/userActions';

import PropTypes from 'prop-types';



class Login extends React.Component{
      state = {
          email: '',
          password: '',
          formErrorMessages: []
        };

      onChange = (e) =>{
          this.setState({[e.target.name]: e.target.value});
      }


      onSubmit = e => {
        e.preventDefault();

        const errors = [];

        if(this.state.email.length === 0){
            errors.push('Please enter a valid email.');
        }

        if(this.state.password.length < 6){
            errors.push('A password must be at least 6 characters.');
        }

        if(errors.length>0){
            this.setState({formErrorMessages: errors});
            return;
        }

        const user = {
          email: this.state.email,
          password: this.state.password,
      }

        this.props.loginUser(user).then((error) => {
          if(error){
            try{
              this.setState({formErrorMessages: [error.response.data]})
            }catch(error){
              this.setState({formErrorMessages: ['Unable to connect to server.']})
            }            
          }
        });

        

      }
      render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
    
        if (this.props.name) {
          return <Redirect to={from} />
        }
    
        return (         
          <Container>
            
                    <h1>Login</h1>
                    
                    {this.props.location.state ? <Alert color="danger">You must login to view this page.</Alert> : ""}
                    {(this.state.formErrorMessages.length > 0) ? <Alert color="danger">{this.state.formErrorMessages.map((message)=>(<div>{message}<hr /></div>))}</Alert> : ""}
                    <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                          <Label for="email">Email Address</Label>
                          <Input name="email" placeholder="" id="email" type="email" onChange={this.onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input name="password" placeholder="" type="password" id="password" onChange={this.onChange}/>
                    </FormGroup>

                    <Button>Log in</Button>
                   
                    </Form>

                    <hr/>
                    <p>Don't have an account? Register <Link to="/register">here</Link>.</p>
            
          </Container>
        )
      }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  loading: state.user.loading,
  name: state.user.name
});

export default connect(mapStateToProps, {loginUser})(Login);