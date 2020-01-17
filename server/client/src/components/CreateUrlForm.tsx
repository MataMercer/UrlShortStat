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
	Label,
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
	errors: string[];
};

type Props = CreateUrlFormProps & LinkDispatchProps & LinkStateProp;

class CreateUrlForm extends Component<Props, CreateUrlFormState> {
	state: CreateUrlFormState = {
		originalUrl: '',
		customUrl: '',
		useCustomUrl: false,
		errors: [],
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
			this.setState({ errors });
			return;
		}

		const newUrl: Url = {
			originalUrl: this.state.originalUrl,
			code: this.state.customUrl,
		};

		await this.props.startCreateUrl(newUrl);

		if(this.props.errors.length > 0){
			this.setState({errors: this.props.errors})
		}else{
			this.props.onToggleCreateUrlForm();
		}
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
						<Form onSubmit={this.onSubmit}>

								<FormGroup>
									<Label for="originalUrl">Original Url</Label>
									<Input
										name="originalUrl"
										placeholder=""
										type="text"
										id="originalUrl"
										onChange={this.onChange}
									/>
								</FormGroup>

								<FormGroup>
											<Input
												name="useCustomUrl"
												addon
												type="checkbox"
												id="useCustomUrl"
												onChange={this.handleCheckboxChange}
												aria-label="Checkbox for following text input"
											/>
											<Label for="useCustomUrl"> Use custom URL</Label>
								</FormGroup>

								{this.state.useCustomUrl ? (
									<FormGroup>
										<Label for="customUrl">Custom Url</Label>
										<Input
											name="customUrl"
											placeholder=""
											type="text"
											id="customUrl"
											onChange={this.onChange}
										/>
									</FormGroup>
								) : (
									''
								)}

								<Button>Create</Button>
						</Form>
					</ModalBody>
				</Modal>
			</Container>
		);
	}
}

interface LinkStateProp {
	loading: boolean;
	errors: string[];
}

interface LinkDispatchProps {
	startCreateUrl: (url: Url) => Promise<void>;
}

const mapStateToProps = (
	state: AppState,
	ownProps: CreateUrlFormProps
): LinkStateProp => ({
	loading: state.url.loading,
	errors:state.url.errors
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: CreateUrlFormProps
): LinkDispatchProps => ({
	startCreateUrl: (url: Url) => dispatch(startCreateUrl(url)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateUrlForm);
