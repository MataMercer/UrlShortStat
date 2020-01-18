import React, { Component } from 'react';
import {
	Col,
	Collapse,
	Container,
	FormGroup,
	Label,
	Input,
	Button,
	Row,
	Spinner,
} from 'reactstrap';

import { connect } from 'react-redux';
import { startDeleteUrl } from '../actions/urlActions';

import axios from 'axios';
import CopyToClipboard from 'react-copy-to-clipboard';
import config from '../config/config';
import UrlAnalytics from './UrlAnalytics';
import { Url } from '../types/Url';
import { AppState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../types/actions';
axios.defaults.withCredentials = true;
var moment = require('moment');

type UrlListItemProps = {
	url: Url;
	setEditingUrl: (url: Url) => void;
	onToggleEditUrlForm: () => void;
};

type UrlListItemState = {
	isOpen: boolean;
	loading: boolean;
	copied: boolean;
	timeSpan: string;
	unitsBackInTime: number;
};

type Props = UrlListItemProps & LinkDispatchProps & LinkStateProp;

class UrlListItem extends Component<Props, UrlListItemState> {
	state: UrlListItemState = {
		isOpen: false,
		loading: false,
		copied: false,
		timeSpan: 'last30days',
		unitsBackInTime: 0,
	};

	onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();

		switch (e.target.name) {
			case 'timeSpan':
				this.setState({ timeSpan: e.target.value });
				break;
			case 'unitsBackInTime':
				this.setState({ unitsBackInTime: Number(e.target.value) });
				break;
		}
		// this.setState({[e.target.name]: e.target.value});
	};

	toggle = (): void => {
		this.setState({ isOpen: !this.state.isOpen });
	};

	onDeleteClick = (e: React.MouseEvent<any, MouseEvent>): void => {
		e.stopPropagation();
		this.props.startDeleteUrl(this.props.url.code);
	};

	onEditClick = (e: React.MouseEvent<any, MouseEvent>) => {
		e.stopPropagation();
		this.props.setEditingUrl(this.props.url);
		this.props.onToggleEditUrlForm();
	};

	stopPropagationClick = (e: React.MouseEvent<any, MouseEvent>) =>{
		e.stopPropagation();
	}

	render() {
		const code = this.props.url.code;
		const originalUrl = this.props.url.originalUrl;
		const fullUrl = config.serverUrl + '/u/' + code;

		return (
			<Container>
				<div onClick={this.toggle.bind(this)} className="url-list-item">
					<Col className={this.state.isOpen ? "url-list-item-header-opened" : "url-list-item-header"}>
						<Row>
							<Col>
								<Button
									className="remove-btn float-right"
									color="danger"
									size="small"
									onClick={this.onDeleteClick.bind(this)}
								>
									<i className="fas fa-trash"></i>
								</Button>

								<Button
									className="remove-btn float-right"
									size="small"
									onClick={this.onEditClick.bind(this)}
								>
									<i className="fas fa-edit"></i>
								</Button>
								<p>
									Created:{' '}
									{moment(this.props.url.createdAt)
										.format('MMM DD, YYYY')
										.toString()}
								</p>
							</Col>
						</Row>

						<Row>
							<Col>
								<h4>
									{fullUrl.length > 100 && !this.state.isOpen
										? fullUrl.slice(-fullUrl.length, 50) + '...'
										: fullUrl}

									<CopyToClipboard
										text={fullUrl}
										onCopy={() => {
											this.setState({ copied: true });
										}}
									>
										<Button
											size="sm"
											onClick={e => {
												e.stopPropagation();
											}}
											className="copy-button"
										>
											{this.state.copied ? (
												<span>Copied!</span>
											) : (
												<span>
													<i className="fas fa-copy"></i>
												</span>
											)}
										</Button>
									</CopyToClipboard>
								</h4>
							</Col>
						</Row>

						<p>
							{originalUrl.length > 100 && !this.state.isOpen
								? originalUrl.slice(-originalUrl.length, 50) + '...'
								: originalUrl}
						</p>
					</Col>
				
				<Collapse
					isOpen={this.state.isOpen}
					className="url-list-item-analytics-section"
					onClick={this.stopPropagationClick.bind(this)}
				>
					<Col>
					<Row>
						<Col>
							<h4>Visits</h4>
						</Col>
					</Row>
					<FormGroup>
						<Label for="timeSpan">Time Period</Label>
						<Input type="select" name="timeSpan" onChange={this.onChange}>
							<option value="last30days">30 Day Period</option>
							<option value="month">Month</option>
							<option value="year">Year</option>
						</Input>

						<Label for="unitsBackInTime">Units Back in Time</Label>
						<Input
							name="unitsBackInTime"
							value={this.state.unitsBackInTime}
							disabled={this.state.unitsBackInTime > 100}
							onChange={this.onChange}
							type="number"
							min="0"
							max="100"
						></Input>
					</FormGroup>
					
					{!this.props.loading ? 
					(<UrlAnalytics
					isOpen={this.state.isOpen}
					timeSpan={this.state.timeSpan}
					code={code}
					unitsBackInTime={this.state.unitsBackInTime}
				></UrlAnalytics>)
					
					: <Spinner></Spinner>}
					
					</Col>
				</Collapse>
				</div>
			</Container>
		);
	}
}

interface LinkStateProp {
	loading: boolean;
}

interface LinkDispatchProps {
	startDeleteUrl: (code: string) => Promise<void>;
}

const mapStateToProps = (state: AppState, ownProps: UrlListItemProps) => ({
	loading: state.url.loading,
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: UrlListItemProps
): LinkDispatchProps => ({
	startDeleteUrl: (code: string) => dispatch(startDeleteUrl(code)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UrlListItem);
