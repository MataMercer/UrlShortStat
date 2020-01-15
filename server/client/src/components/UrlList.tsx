import React, { Component } from 'react';
import { Col, Container, ListGroup, Button, Row, Spinner } from 'reactstrap';
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
    editingUrlCode: string;
}

type Props =  LinkDispatchProps & LinkStateProp;

class UrlList extends Component<Props, UrlListState> {
	state = {
		showCreateUrlForm: false,
		showEditUrlForm: false,
		editingUrlCode: "",
	};

	componentDidMount() {
		this.props.startGetUrls();
	}

	onToggleCreateUrlForm = () => {
		this.setState({ showCreateUrlForm: !this.state.showCreateUrlForm });
	};

	onToggleEditUrlForm = () => {
		this.setState({ showEditUrlForm: !this.state.showEditUrlForm });
	};

	setEditingUrlCode(code: string) {
		this.setState({ editingUrlCode: code });
	}

	render() {
		const urls = this.props.urls;

		return (
			<div>
					<h1>Your URLs</h1>
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
							code={this.state.editingUrlCode}
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
										setEditingUrlCode={this.setEditingUrlCode.bind(this)}
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
}

interface LinkDispatchProps {
	startGetUrls: () => Promise<void>;
}

const mapStateToProps = (
	state: AppState
): LinkStateProp => ({
    loading: state.url.loading,
    urls: state.url.urls,
    urlCount: state.url.urlCount
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
	startGetUrls: () => dispatch(startGetUrls()),
});
export default connect(mapStateToProps, mapDispatchToProps)(UrlList);
