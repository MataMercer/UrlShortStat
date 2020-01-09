import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Alert,
	FormGroup,
	Form,
	Button,
	Container,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
} from 'reactstrap';
import { startEditUrl } from '../actions/urlActions';
import { AppState } from '../store';
import { Url } from '../types/Url';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../types/actions';

type EditUrlFormProps = {
	showEditUrlForm: boolean;
	onToggleEditUrlForm: () => void;
	code: string;
};

type EditUrlFormState = {
	originalUrl: string;
	formErrorMessages: string[];
};

type Props = EditUrlFormProps & LinkDispatchProps & LinkStateProp;
class EditUrlForm extends Component<Props, EditUrlFormState> {
	state: EditUrlFormState = {
		originalUrl: '',
		formErrorMessages: [],
	};

	onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ originalUrl: e.target.value });
	};

	onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();

		const errors = [];
		if (this.state.originalUrl.length === 0) {
			errors.push('A URL is required.');
		}

		if (errors.length > 0) {
			this.setState({ formErrorMessages: errors });
			return;
		}

		const newUrl = {
			originalUrl: this.state.originalUrl,
			code: this.props.code,
		};

		this.props.startEditUrl(newUrl).then(() => {
			// if (error) {
			// 	console.log(error.response);
			// 	this.setState({ formErrorMessages: [error.response.data.message] });
			// }
			//assign errors
		});

		//redir
		// this.props.history.push('/dashboard');
	};

	render() {
		return (
			<Container>
				<Modal
					isOpen={this.props.showEditUrlForm}
					toggle={this.props.onToggleEditUrlForm}
				>
					<ModalBody>
						<ModalHeader toggle={this.props.onToggleEditUrlForm}>
							Edit URL
						</ModalHeader>
						<h4>{this.props.code}</h4>
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
								<InputGroup>
									<InputGroupAddon addonType="prepend">
										<InputGroupText>N</InputGroupText>
									</InputGroupAddon>
									<Input
										name="originalUrl"
										placeholder="URL to shorten"
										type="text"
										onChange={this.onChange}
									/>
								</InputGroup>

								<Button>Save changes</Button>
							</FormGroup>
						</Form>
					</ModalBody>
				</Modal>
			</Container>
		);
	}
}

interface LinkStateProp {
	loading: boolean;
}

interface LinkDispatchProps {
	startEditUrl: (url: Url) => Promise<void>;
}

const mapStateToProps = (state: AppState, ownProps: EditUrlFormProps) => ({
	loading: state.url.loading,
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: EditUrlFormProps
): LinkDispatchProps => ({
	startEditUrl: (url: Url) => dispatch(startEditUrl(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUrlForm);
