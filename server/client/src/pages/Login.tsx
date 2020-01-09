import React from 'react';
import {
	Alert,
	FormGroup,
	Form,
	Button,
	Container,
	Input,
	Label,
} from 'reactstrap';
import {
	BrowserRouter as Router,
	Redirect,
	Link,
	RouteComponentProps,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { startLoginUser } from '../actions/userActions';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../types/actions';
import { AppState } from '../store';
import { User } from '../types/User';

type LoginState = {
	email: string;
	password: string;
	formErrorMessages: string[];
};

type Props = LinkDispatchProps &
	LinkStateProp &
	RouteComponentProps<{}> &
	React.Props<{}>;

class Login extends React.Component<Props, LoginState> {
	state: LoginState = {
		email: '',
		password: '',
		formErrorMessages: [],
	};

	onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		switch (e.target.name) {
			case 'email':
				this.setState({ email: e.target.value });
				break;
			case 'password':
				this.setState({ password: e.target.value });
				break;
		}
	};

	onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();

		const errors = [];

		if (this.state.email.length === 0) {
			errors.push('Please enter a valid email.');
		}

		if (this.state.password.length < 6) {
			errors.push('A password must be at least 6 characters.');
		}

		if (errors.length > 0) {
			this.setState({ formErrorMessages: errors });
			return;
		}

		const user: User = {
			email: this.state.email,
			password: this.state.password,
		};

		this.props.startLoginUser(user);

		// if (error) {
		// 	try {
		// 		this.setState({ formErrorMessages: [error.response.data] });
		// 	} catch (error) {
		// 		this.setState({
		// 			formErrorMessages: ['Unable to connect to server.'],
		// 		});
		// 	}
		// }
	};
	render() {
		const { from } = this.props.location.state || { from: { pathname: '/' } };

		if (this.props.name) {
			return <Redirect to={from} />;
		}

		return (
			<Container>
				<h1>Login</h1>

				{this.props.location.state ? (
					<Alert color="danger">You must login to view this page.</Alert>
				) : (
					''
				)}
				{this.state.formErrorMessages.length > 0 ? (
					<Alert color="danger">
						{this.state.formErrorMessages.map(message => (
							<div>
								{message}
								<hr />
							</div>
						))}
					</Alert>
				) : (
					''
				)}
				<Form onSubmit={this.onSubmit}>
					<FormGroup>
						<Label for="email">Email Address</Label>
						<Input
							name="email"
							placeholder=""
							id="email"
							type="email"
							onChange={this.onChange}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="password">Password</Label>
						<Input
							name="password"
							placeholder=""
							type="password"
							id="password"
							onChange={this.onChange}
						/>
					</FormGroup>

					<Button>Log in</Button>
				</Form>

				<hr />
				<p>
					Don't have an account? Register <Link to="/register">here</Link>.
				</p>
			</Container>
		);
	}
}

interface LinkStateProp {
	loading: boolean;
	name?: string;
}

interface LinkDispatchProps {
	startLoginUser: (user: User) => Promise<void>;
}

const mapStateToProps = (state: AppState): LinkStateProp => ({
	loading: state.user.loading,
	name: state.user.name,
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
	startLoginUser: (user: User) => dispatch(startLoginUser(user)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
