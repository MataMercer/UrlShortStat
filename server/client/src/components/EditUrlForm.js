import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Alert, FormGroup, Form, Button, Container, Card, InputGroup, InputGroupAddon, InputGroupText, Input, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import {editUrl} from '../actions/urlActions';
class EditUrlForm extends React.Component{
    state = {
        originalUrl: '',
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


        this.props.editUrl(newUrl).then((error) => {
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
        <Modal isOpen={this.props.showEditUrlForm} toggle={this.props.onToggleEditUrlForm}>
            <ModalBody>
                <ModalHeader toggle={this.props.onToggleEditUrlForm}>Edit URL</ModalHeader>
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
                


                <Button>Save changes</Button>
                </FormGroup>
                </Form>
            </ModalBody>
            </Modal>
        
        
        </Container>

        );
    }
}

   

EditUrlForm.propTypes = {

    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    loading: state.url.loading,
});


export default connect(mapStateToProps, {editUrl})(EditUrlForm);