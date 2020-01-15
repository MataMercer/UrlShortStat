import React, {Component} from 'react';
import {
	Alert,
	FormGroup,
	Form,
	Button,
	Label,
	Container,
	Input
} from 'reactstrap';

import { connect } from 'react-redux';
import { registerUser, startRegisterUser } from '../actions/userActions';

import PropTypes from 'prop-types';
import { Link, RouteComponentProps } from 'react-router-dom';
import { User } from '../types/User';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../types/actions';
import { AppState } from '../store';


type RegisterProps = {
}

type RegisterState = {
	name: string;
	email: string;
	password: string;
	password2: string;
	errors: string[]; 
}

type Props = RegisterProps & LinkDispatchProps & LinkStateProp & RouteComponentProps<{}> & React.Props<{}>;

class Register extends Component<Props, RegisterState> {
	state:RegisterState ={
		name: '',
		email: '',
		password : '',
		password2: '',
		errors: []
	}

	onChange = (e:React.ChangeEvent<HTMLInputElement>):void =>  {
		switch(e.target.name){
			case 'name':
				this.setState({ name: e.target.value });
				break;
			case 'email':
				this.setState({ email: e.target.value });
				break;
			case 'password':
				this.setState({ password: e.target.value });
				break;
			case 'password2':
				this.setState({ password2: e.target.value });
				break;
		}
	};

	onSubmit = async (e:React.SyntheticEvent) => {
		e.preventDefault();
		
		const errors:string[] = [];
		if (this.state.name.length === 0) {
			errors.push('A username must be at least 1 character.');
		}

		if (this.state.email.length === 0) {
			errors.push('Please enter a valid email.');
		}

		if (this.state.password.length < 6) {
			errors.push('A password must be at least 6 characters.');
		}

		if (this.state.password !== this.state.password2) {
			errors.push('Passwords do not match.');
		}

		if (errors.length > 0) {
			this.setState({ errors });
			return;
		}
		
		await this.props.startRegisterUser({
			name: this.state.name, 
			email: this.state.email, 
			password: this.state.password, 
			password2: this.state.password
		});
		// if (error)
		// 	this.setState({ formErrorMessages: error.response.data.message });
		// else this.props.history.push('/dashboard');
		//redir
		if(this.props.errors.length > 0){
			this.setState({errors: this.props.errors})
		}else{
			this.props.history.push('/dashboard');
		}
		
	};

	render() {
		if (this.props.name) {
			return (
				<Container>
					<Alert color="danger">Please logout to register a new account.</Alert>
				</Container>
			);
		} else {
			return (
				<Container>
					<h1>Register</h1>
					{this.state.errors.length > 0 ? (
						<Alert color="danger">
							{this.state.errors.map((message, index) => (
								<div>
									{message}
									{index !== this.state.errors.length -1 ? <hr />: null}
								</div>
							))}
						</Alert>
					) : (
						''
					)}
					<Form onSubmit={this.onSubmit.bind(this)}>
						<FormGroup>
							<Label for="name">Username</Label>
							<Input
								name="name"
								placeholder="i.e. TimApple"
								id="name"
								type="text"
								onChange={this.onChange}
								value={this.state.name}
							/>
						</FormGroup>

						<FormGroup>
							<Label for="email">Email Address</Label>
							<Input
								name="email"
								placeholder="example@email.com"
								type="email"
								id="email"
								onChange={this.onChange}
								value={this.state.email}
							/>
						</FormGroup>

						<FormGroup>
							<Label for="password">Password</Label>
							<Input
								name="password"
								placeholder="Password (At least 6 characters)"
								id="password"
								type="password"
								onChange={this.onChange}
								value={this.state.password}
							/>
						</FormGroup>

						<FormGroup>
							<Label for="password2">Retype Password</Label>
							<Input
								name="password2"
								placeholder="Retype password"
								type="password"
								id="password2"
								onChange={this.onChange}
								value={this.state.password2}
							/>
						</FormGroup>

						<Button>Register</Button>
					</Form>
					<hr />
					<p>
						Already have an account? Login <Link to="/login">here</Link>.
					</p>
				</Container>
			);
		}
	}
}


// const mapStateToProps = (state) => ({
// 	loading: state.user.loading,
// 	name: state.user.name,
// });

// export default connect(mapStateToProps, { registerUser })(Register);
interface LinkStateProp {
	loading: boolean;
	name?: string;
	errors: string[];
}

interface LinkDispatchProps {
	startRegisterUser: (user:User) => Promise<void>;
}

const mapStateToProps = (
	state: AppState,
	ownProps: RegisterProps
): LinkStateProp => ({
	loading: state.user.loading,
	name: state.user.name,
	errors: state.user.errors
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: RegisterProps
): LinkDispatchProps => ({
	startRegisterUser: (user: User) => dispatch(startRegisterUser(user)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Register);
