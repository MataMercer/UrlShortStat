import React from 'react';
import { Alert, FormGroup, Form, Button, Container, Card, InputGroup, InputGroupAddon, InputGroupText, Input, Spinner } from 'reactstrap';

import {connect} from 'react-redux';
import {registerUser} from '../actions/userActions';

import PropTypes from 'prop-types';
import {

    Redirect,
} from 'react-router-dom'

class Register extends React.Component{
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        formErrorMessages: []
    }

    onChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit = e => {
        e.preventDefault();

        const errors = [];
        if(this.state.name.length === 0){
            errors.push('A username must be at least 1 character.');
        }

        if(this.state.email.length === 0){
            errors.push('Please enter a valid email.');
        }

        if(this.state.password.length < 6){
            errors.push('A password must be at least 6 characters.');
        }

        if(this.state.password !== this.state.password2){
            errors.push('Passwords do not match.');
        }

        if(errors.length>0){
            this.setState({formErrorMessages: errors});
            return;
        }

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        }

        //add item via additem action
        this.props.registerUser(newUser).then((error)=>{
            if(error)
                this.setState({formErrorMessages: error.response.data.message});
            else
                this.props.history.push('/dashboard');
        })

        //redir
        // this.props.history.push('/dashboard');

    }

    render(){
        if(this.props.name){
            return(
                <Container>
                    <Alert color="danger">Please logout to register a new account.</Alert>
                </Container>
            )
        }else{
            return(
                <Container>
                    <Card>
                        <h1>Register</h1>
                        {(this.state.formErrorMessages.length > 0) ? <Alert color="danger">{this.state.formErrorMessages.map((message)=>(<div>{message}<hr /></div>))}</Alert> : ""}
                        <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>N</InputGroupText>
                            </InputGroupAddon>
                            <Input name="name" placeholder="Username"  type="text" onChange={this.onChange}/>
                        </InputGroup>

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

                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>P</InputGroupText>
                            </InputGroupAddon>
                            <Input name="password2" placeholder="Retype the password" type="password" onChange={this.onChange}/>
                        </InputGroup>

                        <Button>Register</Button>
                        </FormGroup>
                        </Form>
                    </Card>
                </Container>
            );
        }
    }
}



Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    loading: state.user.loading,
    name: state.user.name
});


export default connect(mapStateToProps, {registerUser})(Register);