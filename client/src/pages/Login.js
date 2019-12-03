import React from 'react';
import { Alert, FormGroup, Form, Button, Container, Card, InputGroup, InputGroupAddon, InputGroupText, Input, Spinner } from 'reactstrap';
import {
    BrowserRouter as Router,
    Redirect,
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

        this.props.loginUser(user);

        

      }
      render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
    
        if (this.props.name) {
          return <Redirect to={from} />
        }
    
        return (         
          <Container>
            <Card>
                    <h1>Login</h1>
                    
                    {this.props.location.state ? <Alert color="danger">You must login to view this page.</Alert> : ""}
                    {(this.state.formErrorMessages.length > 0) ? <Alert color="danger">{this.state.formErrorMessages.map((message)=>(<div>{message}<hr /></div>))}</Alert> : ""}
                    <Form onSubmit={this.onSubmit}>
                    <FormGroup>

                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>E</InputGroupText>
                        </InputGroupAddon>
                        <Input name="email" placeholder="Email" type="email" onChange={this.onChange}/>
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>P</InputGroupText>
                        </InputGroupAddon>
                        <Input name="password" placeholder="Password (At least 6 characters)" type="password" onChange={this.onChange}/>
                    </InputGroup>

                    <Button>Log in</Button>
                    </FormGroup>
                    </Form>
                </Card>
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