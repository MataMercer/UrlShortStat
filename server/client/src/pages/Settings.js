import React from 'react';
import {
    Label,
    Container,
    Button
} from 'reactstrap';
import {connect} from 'react-redux';
import {editUser} from '../actions/userActions';
class Settings extends React.Component{
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        formErrorMessages: []
    }

    render(){
        return(
            <Container>
            <h1>Account Settings</h1>
            <hr/>
            <h4>Account information</h4>
            <Label>Email</Label>
            {this.props.email}

            <Label>Username</Label>
            {this.props.name}

            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.user.loading,
    name: state.user.name,
    email: state.user.email
});


export default connect(mapStateToProps, {editUser})(Settings);