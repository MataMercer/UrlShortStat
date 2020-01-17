import React, { Component } from 'react';
import { ListGroup, Button, Row, Spinner, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { startGetUrls } from '../actions/urlActions';
import CreateUrlForm from './CreateUrlForm';
import EditUrlForm from './EditUrlForm';
import UrlListItem from './UrlListItem';
import { Url } from '../types/Url';
import { AppState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../types/actions';



type UrlListState = {
    showCreateUrlForm: boolean;
    showEditUrlForm: boolean;
	editingUrl: Url | null;
	errors: string[]
}

type Props =  LinkDispatchProps & LinkStateProp;

class UrlList extends Component<Props, UrlListState> {
	state:UrlListState = {
		showCreateUrlForm: false,
		showEditUrlForm: false,
		editingUrl: null,
		errors: []
	};

	componentDidMount = async () => {
		await this.props.startGetUrls();
		if(this.props.errors.length > 0){
			
			this.setState({errors: this.props.errors})
		}
		
	}

	onToggleCreateUrlForm = () => {
		this.setState({ showCreateUrlForm: !this.state.showCreateUrlForm });
	};

	onToggleEditUrlForm = () => {
		this.setState({ showEditUrlForm: !this.state.showEditUrlForm });
	};

	setEditingUrl(url:Url) {
		this.setState({editingUrl: url });
	}

	render() {
		const urls = this.props.urls;

		return (
			<div>
					<h1>Your URLs</h1>

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

					<hr />
					<h4>
						{this.props.urlCount} URL{this.props.urlCount === 1 ? '' : 's'}
					</h4>

					

					<Button
						onClick={this.onToggleCreateUrlForm.bind(this)}
						color="primary"
					>
						<i className="fas fa-plus"></i>
						{' Shorten a new URL'}
					</Button>

					{this.state.showCreateUrlForm ? (
						<CreateUrlForm
							showCreateUrlForm={this.state.showCreateUrlForm}
							onToggleCreateUrlForm={this.onToggleCreateUrlForm.bind(this)}
						/>
					) : (
						''
					)}

					{this.state.showEditUrlForm ? (
						<EditUrlForm
							showEditUrlForm={this.state.showEditUrlForm}
							onToggleEditUrlForm={this.onToggleEditUrlForm.bind(this)}
							url={this.state.editingUrl}
						/>
					) : (
						''
					)}

					{this.props.loading ? (
						<Spinner />
					) : (
						<ListGroup>
							{urls.map(url => (
								<Row key={url.code}>
									<UrlListItem
										url={url}
										onToggleEditUrlForm={this.onToggleEditUrlForm.bind(this)}
										setEditingUrl={this.setEditingUrl.bind(this)}
									/>
								</Row>
							))}
						</ListGroup>
					)}	
			</div>
		);
	}
}

interface LinkStateProp {
    loading: boolean;
    urls: Url[];
	urlCount: number;
	errors: string[];
}

interface LinkDispatchProps {
	startGetUrls: () => Promise<void>;
}

const mapStateToProps = (
	state: AppState
): LinkStateProp => ({
    loading: state.url.loading,
    urls: state.url.urls,
	urlCount: state.url.urlCount,
	errors: state.url.errors
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
	startGetUrls: () => dispatch(startGetUrls()),
});
export default connect(mapStateToProps, mapDispatchToProps)(UrlList);
