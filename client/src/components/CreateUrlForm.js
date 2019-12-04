import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Alert, FormGroup, Form, Button, Container, Card, InputGroup, InputGroupAddon, InputGroupText, Input, Spinner } from 'reactstrap';

class Register extends React.component{
    state = {
        originalUrl: '',
        customUrl: '',
        useCustomUrl: false,
        formErrorMessages: ''
    }

    onChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit = e => {
        e.preventDefault();

        const errors = [];
        if(this.state.originalUrl.length === 0){
            errors.push('A URL is required.');
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
        this.props.registerUser(newUser);

        //redir
        // this.props.history.push('/dashboard');

    }
}