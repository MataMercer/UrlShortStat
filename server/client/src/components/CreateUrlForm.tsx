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
import { startCreateUrl } from '../actions/urlActions';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../types/actions';
import { AppState } from '../store';
import { Url } from '../types/Url';

type CreateUrlFormProps = {
	showCreateUrlForm: boolean;
	onToggleCreateUrlForm: () => void;
};

type CreateUrlFormState = {
	originalUrl: string;
	customUrl: string;
	useCustomUrl: boolean;
	formErrorMessages: string[];
};

type Props = CreateUrlFormProps & LinkDispatchProps & LinkStateProp;

class CreateUrlForm extends Component<Props, CreateUrlFormState> {
	state: CreateUrlFormState = {
		originalUrl: '',
		customUrl: '',
		useCustomUrl: false,
		formErrorMessages: [],
	};

	onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		switch (e.target.name) {
			case 'originalUrl':
				this.setState({ originalUrl: e.target.value });
				break;
			case 'customUrl':
				this.setState({ customUrl: e.target.value });
				break;
		}
	};

	handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		this.setState({ useCustomUrl: e.target.checked });
	};

	onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();

		const errors = [];
		if (this.state.originalUrl.length === 0) {
			errors.push('A URL is required.');
		}

		if (errors.length > 0) {
			this.setState({ formErrorMessages: errors });
			return;
		}

		const newUrl: Url = {
			originalUrl: this.state.originalUrl,
			code: this.state.customUrl,
		};

        await this.props.startCreateUrl(newUrl);
        //add error/show errors
	};

	render() {
		return (
			<Container>
				<Modal
					isOpen={this.props.showCreateUrlForm}
					toggle={this.props.onToggleCreateUrlForm}
				>
					<ModalBody>
						<ModalHeader toggle={this.props.onToggleCreateUrlForm}>
							Create URL
						</ModalHeader>
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

								<InputGroup>
									<InputGroupAddon addonType="prepend">
										<InputGroupText>
											<Input
												name="useCustomUrl"
												addon
												type="checkbox"
												onChange={this.handleCheckboxChange}
												aria-label="Checkbox for following text input"
											/>
											Use custom URL
										</InputGroupText>
									</InputGroupAddon>
								</InputGroup>

								{this.state.useCustomUrl ? (
									<InputGroup>
										<InputGroupAddon addonType="prepend">
											<InputGroupText>E</InputGroupText>
										</InputGroupAddon>
										<Input
											name="customUrl"
											placeholder="Custom URL"
											type="text"
											onChange={this.onChange}
										/>
									</InputGroup>
								) : (
									''
								)}

								<Button>Create</Button>
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
	startCreateUrl: (url: Url) => Promise<void>;
}

const mapStateToProps = (
	state: AppState,
	ownProps: CreateUrlFormProps
): LinkStateProp => ({
	loading: state.url.loading,
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: CreateUrlFormProps
): LinkDispatchProps => ({
	startCreateUrl: (url: Url) => dispatch(startCreateUrl(url)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateUrlForm);
