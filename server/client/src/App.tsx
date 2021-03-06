import React, { Component } from 'react';
import './stylesheets/main.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AppNavbar from './components/AppNavbar';
import Routes from './routes/Routes';
import { connect } from 'react-redux';
import { startCheckUserSession } from './actions/userActions';
import { Spinner, Container } from 'reactstrap';
import { AppState } from './store';
import { AppActions } from './types/actions';
import { ThunkDispatch } from 'redux-thunk';
import { Route, RouteComponentProps } from 'react-router-dom';

type AppProps = {};

type AppCompState = {};
type Props = AppProps & LinkStateProp & LinkDispatchProps;
class App extends Component<Props, AppCompState> {
	componentDidMount() {
		this.props.startCheckUserSession();
	}

	render() {
		return (
			<div className="App">
				<AppNavbar />
				{this.props.loading ? (
					<Spinner />
				) : (
					<Container className="page-content">
						<Route
							render={(locationProps: RouteComponentProps) => (
								<Routes {...locationProps} />
							)}
						/>
					</Container>
				)}
			</div>
		);
	}
}

interface LinkStateProp {
	name?: string;
	loading: boolean;
}

interface LinkDispatchProps {
	startCheckUserSession: () => Promise<void>;
}

const mapStateToProps = (
	state: AppState,
	ownProps: AppProps
): LinkStateProp => ({
	name: state.user.name,
	loading: state.user.loading,
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: AppProps
): LinkDispatchProps => ({
	startCheckUserSession: () => dispatch(startCheckUserSession()),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
