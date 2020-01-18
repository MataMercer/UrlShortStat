import React from 'react';
import { Label, Container, Button, Row, Col, Input, Alert, Form, ModalHeader, ModalBody, Modal } from 'reactstrap';
import { connect } from 'react-redux';
import { startEditUser, startDeleteUser } from '../actions/userActions';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../types/actions';
import { AppState } from '../store';
import { RouteComponentProps } from 'react-router-dom';
import { User } from '../types/User';

type SettingsProps = {};

type SettingsState = {
	name: string;
	email: string;
	password: string;
	password2: string;
	errors: string[];

	showNameInput: boolean;
	showEmailInput: boolean;
	showPasswordInput: boolean;
	showDeleteModal: boolean;
};

type Props = SettingsProps &
	LinkStateProp &
	LinkDispatchProps &
	RouteComponentProps<{}> &
	React.Props<{}>;

class Settings extends React.Component<Props, SettingsState> {
	state: SettingsState = {
		name: '',
		email: '',
		password: '',
		password2: '',
		errors: [],

		showNameInput: false,
		showEmailInput: false,
		showPasswordInput: false,
		showDeleteModal: false
	};

	onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		switch (e.target.name) {
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

	onClickToggleInput = (e: React.MouseEvent<HTMLButtonElement>) => {
		switch (e.currentTarget.name) {
			case 'name':
				if(this.state.showNameInput){
					this.setState({name: ''})
				}
				this.setState({ showNameInput: !this.state.showNameInput });
				break;
			case 'email':
				if(this.state.showEmailInput){
					this.setState({email: ''})
				}
				this.setState({ showEmailInput: !this.state.showEmailInput });
				break;
			case 'password':
				if(this.state.showPasswordInput){
					this.setState({password: '', password2: ''})
				}
				this.setState({ showPasswordInput: !this.state.showPasswordInput });
				break;
		}
	};

	onDeleteAccountClick = async () => {
		await this.props.startDeleteUser();

		if (this.props.errors.length > 0) {
			this.setState({ errors: this.props.errors });
		}
	}

	onSubmitAccountChanges = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		const errors: string[] = [];

		if (this.state.email && this.state.email.length === 0) {
			errors.push('Please enter a valid email.');
		}

		if (this.state.password && this.state.password.length < 6) {
			errors.push('A password must be at least 6 characters.');
		}

		if (this.state.password && this.state.password !== this.state.password2) {
			errors.push('Passwords do not match.');
		}

		if (errors.length > 0) {
			this.setState({ errors });
			return;
		}

		await this.props.startEditUser({
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2,
		});
		// if (error)
		// 	this.setState({ formErrorMessages: error.response.data.message });
		// else this.props.history.push('/dashboard');
		//redir
		if (this.props.errors.length > 0) {
			this.setState({ errors: this.props.errors });
		}else{
			this.setState({showNameInput: false, showEmailInput: false, showPasswordInput: false})
		}
	};

	onToggleDeleteModal = () => {
		this.setState({ showDeleteModal: !this.state.showDeleteModal });
	};

	render() {
		return (
			<Container>
				<h1>Account Settings</h1>
				<hr />

				<Form onSubmit={this.onSubmitAccountChanges.bind(this)}>
				<h4>Account Information</h4>

				{this.state.errors.length > 0 ? (
					<Alert color="danger">
						{this.state.errors.map((message, index) => (
							<div>
								{message}
								{index !== this.state.errors.length - 1 ? <hr /> : null}
							</div>
						))}
					</Alert>
				) : (
					''
				)}

				<Row>
					<Col>
						<Label>Email</Label>
					</Col>

					<Col md="3" className="text-right">
						{this.state.showEmailInput ? (
							<Input
								name="email"
								type="email"
								id="email"
								onChange={this.onInputChange}
								value={this.state.email}
							/>
						) : (
							this.props.email
						)}
						<Button size="sm" name="email" onClick={this.onClickToggleInput}>
							{this.state.showEmailInput ? 'Cancel' : 'Change'}
						</Button>
					</Col>
				</Row>

				<Row>
					<Col>
						<Label>Username</Label>
					</Col>
					<Col md="3" className="text-right">
						{this.state.showNameInput ? (
							<Input
								name="name"
								type="text"
								id="name"
								onChange={this.onInputChange}
								value={this.state.name}
							/>
						) : (
							this.props.name
						)}
						<Button size="sm" name="name" onClick={this.onClickToggleInput}>
							{this.state.showNameInput ? 'Cancel' : 'Change'}
						</Button>
					</Col>
				</Row>

				<Row>
					<Col>
						<Label>Password</Label>
					</Col>
					<Col md="3" className="text-right">
						{this.state.showPasswordInput ? (
							<div>
								<p>*Passwords must be at least 6 characters.</p>

								<Input
									name="password"
									type="password"
									id="password"
									onChange={this.onInputChange}
									value={this.state.password}
								/>
								<p>*Please retype your password.</p>
								<Input
									name="password2"
									type="password"
									id="password2"
									onChange={this.onInputChange}
									value={this.state.password2}
								/>
							</div>
						) : (
							'******'
						)}
						<Button size="sm" name="password" onClick={this.onClickToggleInput}>
							{this.state.showPasswordInput ? 'Cancel' : 'Change'}
						</Button>
					</Col>
				</Row>

				<Button
					disabled={
						this.state.email || this.state.name || this.state.password
							? false
							: true
					}
				>
					Save Changes
				</Button>

				</Form>

				<h4>Account Deletion</h4>
				<Button color="danger" onClick={this.onToggleDeleteModal.bind(this)}>Delete Account</Button>
				<Modal
					isOpen={this.state.showDeleteModal}
					toggle={this.onToggleDeleteModal.bind(this)}
				>
					<ModalBody>
						<ModalHeader fluid="sm" toggle={this.onToggleDeleteModal.bind(this)}>
							Delete Account
						</ModalHeader>
						{this.state.errors.length > 0 ? (
							<Alert color="danger">
								{this.state.errors.map(message => (
									<div>
										{message}
										<hr />
									</div>
								))}
							</Alert>
						) : (
							''
						)}
						<p>Are you sure you want to delete your account? All saved data will be deleted. This cannot be undone.</p>
						<Row className="text-center"><Col className="text-right"><Button color="danger" onClick={this.onDeleteAccountClick.bind(this)}>Yes, delete my account</Button></Col>
						<Col className="text-center"><Button color="secondary" onClick={this.onToggleDeleteModal.bind(this)}>Cancel</Button></Col></Row>
					</ModalBody>
				</Modal>
			</Container>
		);
	}
}

// const mapStateToProps = state => ({
// 	loading: state.user.loading,
// 	name: state.user.name,
// 	email: state.user.email,
// });

// export default connect(mapStateToProps, { editUser })(Settings);

interface LinkStateProp {
	name?: string;
	loading: boolean;
	email?: string;
	errors: string[];
}

interface LinkDispatchProps {
	startEditUser: (user: User) => Promise<void>;
	startDeleteUser: () => Promise<void>;
}

const mapStateToProps = (
	state: AppState,
	ownProps: SettingsProps
): LinkStateProp => ({
	name: state.user.name,
	loading: state.user.loading,
	email: state.user.email,
	errors: state.user.errors,
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: SettingsProps
): LinkDispatchProps => ({
	startEditUser: (user: User) => dispatch(startEditUser(user)),
	startDeleteUser: () => dispatch(startDeleteUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
