import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Alert, FormGroup, Form, Button, Container, Card, InputGroup, InputGroupAddon, InputGroupText, Input, Spinner } from 'reactstrap';
import {createUrl} from '../actions/urlActions';
class CreateUrlForm extends React.Component{
    state = {
        originalUrl: '',
        customUrl: '',
        useCustomUrl: false,
        formErrorMessages: ''
    }

    onChange = (e) =>{

        this.setState({[e.target.name]: e.target.value});
    }

    handleCheckboxChange = (e) => {
        this.setState({useCustomUrl: e.target.checked});
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

        const newUrl = {
            originalUrl: this.state.originalUrl,
            customUrl: this.state.customUrl,
        }


        this.props.createUrl(newUrl).then((error) => {
            if(error){
                console.log(error.response);
                this.setState({formErrorMessages: [error.response.data.message]});
            }
        });

        //redir
        // this.props.history.push('/dashboard');

    }

    render(){
        return (
        <Container>
            <Card>

                {(this.state.formErrorMessages.length > 0) ? 
                    <Alert color="danger">
                        {this.state.formErrorMessages.map((message)=>(<div>{message}<hr /></div>))}
                    </Alert> : ""}
                <Form onSubmit={this.onSubmit}>
                <FormGroup>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>N</InputGroupText>
                    </InputGroupAddon>
                    <Input name="originalUrl" placeholder="URL to shorten"  type="text" onChange={this.onChange}/>
                </InputGroup>

                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <Input name="useCustomUrl" addon type="checkbox" onChange={this.handleCheckboxChange} aria-label="Checkbox for following text input" />
                         Use custom URL
                        </InputGroupText>
                    </InputGroupAddon>

                </InputGroup>
                
                {
                    this.state.useCustomUrl ?
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>E</InputGroupText>
                        </InputGroupAddon>
                        <Input name="customUrl" placeholder="Custom URL" type="text" onChange={this.onChange}/>
                    </InputGroup>
                    : ""
                }
                


                <Button>Create</Button>
                </FormGroup>
                </Form>
            </Card>
        
        
        </Container>

        );
    }
}

   

CreateUrlForm.propTypes = {

    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    loading: state.url.loading,
});


export default connect(mapStateToProps, {createUrl})(CreateUrlForm);