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
	Row,
	Label,
} from 'reactstrap';
import { startEditUrl } from '../actions/urlActions';
import { AppState } from '../store';
import { Url } from '../types/Url';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../types/actions';
import config from '../config/config';

type EditUrlFormProps = {
	showEditUrlForm: boolean;
	onToggleEditUrlForm: () => void;
	url: Url | null;
};

type EditUrlFormState = {
	originalUrl: string;
	errors: string[];
};

type Props = EditUrlFormProps & LinkDispatchProps & LinkStateProp;
class EditUrlForm extends Component<Props, EditUrlFormState> {
	state: EditUrlFormState = {
		originalUrl: '',
		errors: [],
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
			this.setState({ errors });
			return;
		}
		if(this.props.url === null){
			return;
		}
		const newUrl = {
			originalUrl: this.state.originalUrl,
			code: this.props.url.code,
		};

		this.props.startEditUrl(newUrl).then(() => {
			// if (error) {
			// 	console.log(error.response);
			// 	this.setState({ formErrorMessages: [error.response.data.message] });
			// }
			//assign errors
		});

		if(this.props.errors.length > 0){
			this.setState({errors: this.props.errors})
		}else{
			this.props.onToggleEditUrlForm();
		}


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
							<Row>Editing URL</Row>
							<Row>{this.props.url ? config.serverUrl + '/u/' + this.props.url.code : null}</Row>
							
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
										id="originalUrl"
										type="text"
										placeholder={this.props.url ? this.props.url.originalUrl : ''}
										onChange={this.onChange}
									/>
							</FormGroup>
							<Button>Save</Button>
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
	startEditUrl: (url: Url) => Promise<void>;
}

const mapStateToProps = (state: AppState, ownProps: EditUrlFormProps) => ({
	loading: state.url.loading,
	errors: state.url.errors
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: EditUrlFormProps
): LinkDispatchProps => ({
	startEditUrl: (url: Url) => dispatch(startEditUrl(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUrlForm);
